import mongoose from 'mongoose';

const CartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  variant: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  // Cached product/variant data for faster access
  productData: {
    name: String,
    slug: String,
    image: String
  },
  variantData: {
    size: String,
    sku: String,
    price: Number,
    promotionalPrice: Number,
    imageUrl: String,
    imageUrls: [String]
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: false
});

const CartSchema = new mongoose.Schema({
  // Either userId for authenticated users or sessionId for guests
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    sparse: true
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer', 
    sparse: true
  },
  sessionId: {
    type: String,
    sparse: true
  },
  
  // Cart type
  type: {
    type: String,
    enum: ['guest', 'user', 'customer'],
    required: true,
    default: 'guest'
  },
  
  // Cart items
  items: [CartItemSchema],
  
  // Calculated totals
  subtotal: {
    type: Number,
    default: 0,
    min: 0
  },
  itemCount: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // Cart metadata
  currency: {
    type: String,
    default: 'MAD'
  },
  
  // Cart state
  status: {
    type: String,
    enum: ['active', 'abandoned', 'converted', 'merged'],
    default: 'active'
  },
  
  // Expiry for guest carts
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  },
  
  // Merge tracking
  mergedFrom: [{
    cartId: mongoose.Schema.Types.ObjectId,
    mergedAt: Date,
    strategy: {
      type: String,
      enum: ['merge', 'replace', 'keep_existing']
    }
  }],
  
  // Last activity for cleanup
  lastActivity: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for performance
CartSchema.index({ userId: 1, status: 1 });
CartSchema.index({ customerId: 1, status: 1 });
CartSchema.index({ sessionId: 1, status: 1 });
CartSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL for guest carts
CartSchema.index({ lastActivity: 1 }); // For cleanup jobs

// Virtual for total items
CartSchema.virtual('totalItems').get(function() {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

// Virtual for checking if cart is empty
CartSchema.virtual('isEmpty').get(function() {
  return this.items.length === 0;
});

// Pre-save middleware to calculate totals
CartSchema.pre('save', function(next) {
  this.itemCount = this.items.reduce((total, item) => total + item.quantity, 0);
  this.subtotal = this.items.reduce((total, item) => {
    const price = item.variantData?.promotionalPrice || item.variantData?.price || item.price;
    return total + (price * item.quantity);
  }, 0);
  
  this.lastActivity = new Date();
  next();
});

// Methods
CartSchema.methods.addItem = function(productId, variantId, quantity, productData, variantData) {
  // Check if item already exists
  const existingItem = this.items.find(item => 
    item.product.toString() === productId.toString() && 
    item.variant.toString() === variantId.toString()
  );
  
  if (existingItem) {
    existingItem.quantity += quantity;
    existingItem.variantData = variantData; // Update cached data
  } else {
    const price = variantData?.promotionalPrice || variantData?.price || 0;
    this.items.push({
      product: productId,
      variant: variantId,
      quantity,
      price,
      productData,
      variantData
    });
  }
  
  return this.save();
};

CartSchema.methods.removeItem = function(itemId) {
  this.items = this.items.filter(item => item._id.toString() !== itemId.toString());
  return this.save();
};

CartSchema.methods.updateItemQuantity = function(itemId, quantity) {
  const item = this.items.find(item => item._id.toString() === itemId.toString());
  if (item) {
    if (quantity <= 0) {
      return this.removeItem(itemId);
    }
    item.quantity = quantity;
    return this.save();
  }
  throw new Error('Item not found in cart');
};

CartSchema.methods.clear = function() {
  this.items = [];
  return this.save();
};

CartSchema.methods.mergeCarts = function(otherCart, strategy = 'merge') {
  switch (strategy) {
    case 'merge':
      // Merge items, combining quantities for duplicates
      otherCart.items.forEach(otherItem => {
        const existingItem = this.items.find(item =>
          item.product.toString() === otherItem.product.toString() &&
          item.variant.toString() === otherItem.variant.toString()
        );
        
        if (existingItem) {
          existingItem.quantity += otherItem.quantity;
          // Update with newer data
          existingItem.variantData = otherItem.variantData;
        } else {
          this.items.push(otherItem);
        }
      });
      break;
      
    case 'replace':
      // Replace current cart with other cart
      this.items = [...otherCart.items];
      break;
      
    case 'keep_existing':
      // Keep current cart, don't merge
      break;
  }
  
  // Track merge
  this.mergedFrom.push({
    cartId: otherCart._id,
    mergedAt: new Date(),
    strategy
  });
  
  return this.save();
};

CartSchema.statics.findActiveCart = function(userId, customerId, sessionId) {
  const query = { status: 'active' };
  
  if (userId) {
    query.userId = userId;
  } else if (customerId) {
    query.customerId = customerId;
  } else if (sessionId) {
    query.sessionId = sessionId;
  } else {
    return null;
  }
  
  return this.findOne(query);
};

CartSchema.statics.createCart = function(userId, customerId, sessionId, type = 'guest') {
  const cartData = {
    type,
    items: [],
    status: 'active'
  };
  
  if (userId) {
    cartData.userId = userId;
    cartData.type = 'user';
  } else if (customerId) {
    cartData.customerId = customerId;
    cartData.type = 'customer';
  } else if (sessionId) {
    cartData.sessionId = sessionId;
    cartData.type = 'guest';
  }
  
  return this.create(cartData);
};

// Export model
const Cart = mongoose.models.Cart || mongoose.model('Cart', CartSchema);
export default Cart;

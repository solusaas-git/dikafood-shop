import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  productName: String, // Store name for historical purposes
  variant: {
    size: String,
    unit: String,
    sku: String,
    imageUrl: String,
    imageUrls: [String]
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  promotionalPrice: Number,
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  discount: {
    type: Number,
    default: 0,
    min: 0
  }
});

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true
  },
  confirmationToken: {
    type: String,
    required: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
    default: 'pending'
  },
  items: [orderItemSchema],
  
  // Pricing
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  tax: {
    type: Number,
    default: 0,
    min: 0
  },
  shipping: {
    type: Number,
    default: 0,
    min: 0
  },
  discount: {
    type: Number,
    default: 0,
    min: 0
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },

  // Addresses
  shippingAddress: {
    firstName: String,
    lastName: String,
    company: String,
    street: { type: String, required: true },
    street2: String,
    city: { type: String, required: true },
    state: String,
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
    phone: String,
    instructions: String
  },
  billingAddress: {
    firstName: String,
    lastName: String,
    company: String,
    street: { type: String, required: true },
    street2: String,
    city: { type: String, required: true },
    state: String,
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
    phone: String
  },

  // Payment
  paymentMethod: {
    type: String,
    enum: ['cash_on_delivery', 'bank_transfer', 'credit_card', 'store_credit'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded', 'partially_refunded'],
    default: 'pending'
  },
  paymentDate: Date,

  // Delivery
  deliveryMethod: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DeliveryMethod'
  },
  estimatedDeliveryDate: Date,
  actualDeliveryDate: Date,
  trackingNumber: String,
  carrier: String,

  // Notes and history
  notes: String,
  customerNotes: String,
  history: [{
    status: String,
    note: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],

  // Admin tracking
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true }
});

// Indexes for better performance
orderSchema.index({ customer: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ orderNumber: 1 }, { unique: true });
orderSchema.index({ confirmationToken: 1 }, { unique: true });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ estimatedDeliveryDate: 1 });
orderSchema.index({ actualDeliveryDate: 1 });
// Compound index for customer order details queries
orderSchema.index({ _id: 1, customer: 1 });
// Compound index for customer orders list (sorted by creation date)
orderSchema.index({ customer: 1, createdAt: -1 });

// Virtual for order items count
orderSchema.virtual('itemsCount').get(function() {
  if (!this.items || !Array.isArray(this.items)) {
    return 0;
  }
  return this.items.reduce((total, item) => total + (item.quantity || 0), 0);
});

// Pre-save middleware to generate order number and confirmation token
orderSchema.pre('save', async function(next) {
  if (this.isNew) {
    // Generate order number: ORD-YYYYMMDD-XXXX
    if (!this.orderNumber) {
      const date = new Date();
      const dateStr = date.getFullYear().toString() + 
                     (date.getMonth() + 1).toString().padStart(2, '0') + 
                     date.getDate().toString().padStart(2, '0');
      
      // Find the highest order number for today
      const lastOrder = await this.constructor.findOne({
        orderNumber: { $regex: `^ORD-${dateStr}-` }
      }).sort({ orderNumber: -1 });

      let sequence = 1;
      if (lastOrder) {
        const lastSequence = parseInt(lastOrder.orderNumber.split('-')[2]);
        sequence = lastSequence + 1;
      }

      this.orderNumber = `ORD-${dateStr}-${sequence.toString().padStart(4, '0')}`;
    }
    
    // Generate secure confirmation token (fallback if not provided)
    if (!this.confirmationToken) {
      const crypto = await import('crypto');
      this.confirmationToken = crypto.randomBytes(32).toString('hex');
    }
  }
  next();
});

// Instance method to add history entry
orderSchema.methods.addHistory = function(status, note, updatedBy) {
  this.history.push({
    status,
    note,
    updatedBy
  });
  this.status = status;
  this.updatedBy = updatedBy;
};

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

export default Order;

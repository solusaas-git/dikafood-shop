import mongoose from 'mongoose';

const ProductVariantSchema = new mongoose.Schema({
  size: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  promotionalPrice: {
    type: Number,
    min: 0,
    validate: {
      validator: function(v) {
        // Skip validation if promotional price is not set, is 0, or is null/undefined
        if (!v || v === 0 || v === null || v === undefined) {
          return true;
        }
        
        // Promotional price must be less than regular price if it exists and is greater than 0
        const regularPrice = this.price || 0;
        const isValid = v < regularPrice;
        
        // Debug logging
        if (!isValid) {
          console.log(`Promotional price validation failed: promo=${v}, regular=${regularPrice}`);
        }
        
        return isValid;
      },
      message: 'Promotional price must be less than regular price'
    }
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  sku: {
    type: String,
    trim: true,
    unique: true,
    sparse: true
  },
  imageUrl: {
    type: String,
    trim: true
  },
  imageUrls: [{
    type: String,
    trim: true
  }],
  weight: {
    type: Number,
    min: 0
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number
  },
  isActive: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  shortDescription: {
    type: String,
    maxlength: 300,
    trim: true
  },
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brand',
    required: true
  },
  brandDisplayName: {
    type: String,
    trim: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  categoryName: {
    type: String,
    trim: true
  },
  variants: [ProductVariantSchema],
  images: [{
    url: String,
    alt: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  features: [{
    type: String,
    trim: true
  }],
  benefits: [{
    type: String,
    trim: true
  }],
  ingredients: [{
    name: String,
    percentage: Number
  }],
  nutritionalInfo: {
    calories: Number,
    protein: Number,
    carbohydrates: Number,
    fat: Number,
    fiber: Number,
    sugar: Number,
    sodium: Number,
    servingSize: String
  },
  allergens: [{
    type: String,
    trim: true
  }],
  tags: [{
    type: String,
    trim: true
  }],
  status: {
    type: String,
    enum: ['draft', 'active', 'inactive', 'discontinued'],
    default: 'draft'
  },
  featured: {
    type: Boolean,
    default: false
  },
  isOrganic: {
    type: Boolean,
    default: false
  },
  origin: {
    country: String,
    region: String
  },
  certifications: [{
    name: String,
    certificationBody: String,
    expiryDate: Date
  }],
  seoTitle: {
    type: String,
    maxlength: 60
  },
  seoDescription: {
    type: String,
    maxlength: 160
  },
  seoKeywords: [{
    type: String,
    trim: true
  }],
  relatedProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  averageRating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  reviewCount: {
    type: Number,
    min: 0,
    default: 0
  },
  totalSales: {
    type: Number,
    min: 0,
    default: 0
  },
  viewCount: {
    type: Number,
    min: 0,
    default: 0
  },
  lastRestocked: {
    type: Date
  },
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
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance (slug and variants.sku already indexed via unique: true)
ProductSchema.index({ brand: 1 });
ProductSchema.index({ category: 1 });
ProductSchema.index({ status: 1 });
ProductSchema.index({ featured: 1 });
ProductSchema.index({ tags: 1 });
ProductSchema.index({ createdAt: -1 });
ProductSchema.index({ averageRating: -1 });
ProductSchema.index({ totalSales: -1 });

// Virtual for total stock across all variants
ProductSchema.virtual('totalStock').get(function() {
  if (!this.variants || this.variants.length === 0) return 0;
  return this.variants.reduce((total, variant) => total + (variant.stock || 0), 0);
});

// Virtual for minimum price
ProductSchema.virtual('minPrice').get(function() {
  if (!this.variants || this.variants.length === 0) return 0;
  return Math.min(...this.variants.map(v => v.price));
});

// Virtual for maximum price
ProductSchema.virtual('maxPrice').get(function() {
  if (!this.variants || this.variants.length === 0) return 0;
  return Math.max(...this.variants.map(v => v.price));
});

// Virtual for in stock status
ProductSchema.virtual('inStock').get(function() {
  return this.totalStock > 0;
});

// Pre-save middleware to generate slug
ProductSchema.pre('save', function(next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  }
  next();
});

// Pre-save middleware to update brandDisplayName and categoryName
ProductSchema.pre('save', async function(next) {
  if (this.isModified('brand') && this.brand) {
    try {
      const Brand = mongoose.model('Brand');
      const brand = await Brand.findById(this.brand);
      if (brand) {
        this.brandDisplayName = brand.name;
      }
    } catch (error) {
      console.warn('Could not populate brand name:', error);
    }
  }

  if (this.isModified('category') && this.category) {
    try {
      const Category = mongoose.model('Category');
      const category = await Category.findById(this.category);
      if (category) {
        this.categoryName = category.name;
      }
    } catch (error) {
      console.warn('Could not populate category name:', error);
    }
  }

  next();
});

// Static method to find products with stock
ProductSchema.statics.findInStock = function() {
  return this.find({
    status: 'active',
    'variants.stock': { $gt: 0 }
  });
};

// Static method to find featured products
ProductSchema.statics.findFeatured = function(limit = 10) {
  return this.find({
    status: 'active',
    featured: true
  }).limit(limit);
};

// Instance method to check if product is in stock
ProductSchema.methods.isInStock = function() {
  return this.variants.some(variant => variant.stock > 0);
};

// Instance method to get primary image
ProductSchema.methods.getPrimaryImage = function() {
  const primaryImage = this.images.find(img => img.isPrimary);
  return primaryImage || this.images[0] || null;
};

// Instance method to update stock
ProductSchema.methods.updateStock = function(variantId, quantity) {
  const variant = this.variants.id(variantId);
  if (variant) {
    variant.stock = Math.max(0, variant.stock + quantity);
    return this.save();
  }
  throw new Error('Variant not found');
};

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);

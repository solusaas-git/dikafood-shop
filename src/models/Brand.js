import mongoose from 'mongoose';

const BrandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
    unique: true
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
    maxlength: 1000,
    trim: true
  },
  logo: {
    url: String,
    alt: String
  },
  website: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'Website must be a valid URL'
    }
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        return !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: 'Email must be valid'
    }
  },
  phone: {
    type: String,
    trim: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    postalCode: String
  },
  socialMedia: {
    facebook: String,
    instagram: String,
    twitter: String,
    linkedin: String
  },
  origin: {
    country: String,
    region: String
  },
  founded: {
    type: Date
  },
  certifications: [{
    name: String,
    certificationBody: String,
    certificateNumber: String,
    issuedDate: Date,
    expiryDate: Date,
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  specialties: [{
    type: String,
    trim: true
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  sortOrder: {
    type: Number,
    default: 0
  },
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
  productCount: {
    type: Number,
    default: 0,
    min: 0
  },
  averageRating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  totalSales: {
    type: Number,
    min: 0,
    default: 0
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

// Indexes (slug already indexed via unique: true)
BrandSchema.index({ isActive: 1 });
BrandSchema.index({ isFeatured: 1 });
BrandSchema.index({ sortOrder: 1 });
BrandSchema.index({ productCount: -1 });
BrandSchema.index({ averageRating: -1 });
BrandSchema.index({ totalSales: -1 });

// Virtual for products of this brand
BrandSchema.virtual('products', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'brand'
});

// Pre-save middleware to generate slug
BrandSchema.pre('save', function(next) {
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

// Static method to get featured brands
BrandSchema.statics.getFeatured = function(limit = 10) {
  return this.find({
    isActive: true,
    isFeatured: true
  })
  .sort({ sortOrder: 1, name: 1 })
  .limit(limit);
};

// Static method to get brands with products
BrandSchema.statics.getWithProducts = function() {
  return this.find({
    isActive: true,
    productCount: { $gt: 0 }
  })
  .sort({ productCount: -1, name: 1 });
};

// Instance method to update product count
BrandSchema.methods.updateProductCount = async function() {
  const Product = mongoose.model('Product');
  const count = await Product.countDocuments({ 
    brand: this._id, 
    status: 'active' 
  });
  this.productCount = count;
  return this.save();
};

// Instance method to calculate average rating
BrandSchema.methods.calculateAverageRating = async function() {
  const Product = mongoose.model('Product');
  const products = await Product.find({ 
    brand: this._id, 
    status: 'active' 
  });
  
  if (products.length === 0) {
    this.averageRating = 0;
    return this.save();
  }

  const totalRating = products.reduce((sum, product) => sum + (product.averageRating || 0), 0);
  this.averageRating = totalRating / products.length;
  return this.save();
};

// Instance method to calculate total sales
BrandSchema.methods.calculateTotalSales = async function() {
  const Product = mongoose.model('Product');
  const products = await Product.find({ 
    brand: this._id, 
    status: 'active' 
  });
  
  const totalSales = products.reduce((sum, product) => sum + (product.totalSales || 0), 0);
  this.totalSales = totalSales;
  return this.save();
};

// Instance method to get top products
BrandSchema.methods.getTopProducts = function(limit = 5) {
  const Product = mongoose.model('Product');
  return Product.find({ 
    brand: this._id, 
    status: 'active' 
  })
  .sort({ totalSales: -1, averageRating: -1 })
  .limit(limit);
};

export default mongoose.models.Brand || mongoose.model('Brand', BrandSchema);

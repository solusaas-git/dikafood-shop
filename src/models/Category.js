import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
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
    maxlength: 500,
    trim: true
  },
  image: {
    url: String,
    alt: String
  },
  icon: {
    type: String,
    trim: true
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  level: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  path: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
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
  featuredProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
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
CategorySchema.index({ parent: 1 });
CategorySchema.index({ level: 1 });
CategorySchema.index({ path: 1 });
CategorySchema.index({ isActive: 1 });
CategorySchema.index({ sortOrder: 1 });

// Virtual for children categories
CategorySchema.virtual('children', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parent'
});

// Virtual for products in this category
CategorySchema.virtual('products', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'category'
});

// Pre-save middleware to generate slug
CategorySchema.pre('save', function(next) {
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

// Pre-save middleware to set level and path
CategorySchema.pre('save', async function(next) {
  if (this.isModified('parent')) {
    if (this.parent) {
      try {
        const parentCategory = await this.constructor.findById(this.parent);
        if (parentCategory) {
          this.level = parentCategory.level + 1;
          this.path = parentCategory.path ? `${parentCategory.path}/${parentCategory.slug}` : parentCategory.slug;
        }
      } catch (error) {
        console.warn('Could not populate parent category:', error);
      }
    } else {
      this.level = 0;
      this.path = '';
    }
  }
  next();
});

// Static method to get category tree
CategorySchema.statics.getTree = async function() {
  const categories = await this.find({ isActive: true })
    .sort({ level: 1, sortOrder: 1, name: 1 })
    .populate('children');
  
  const categoryMap = {};
  const rootCategories = [];

  // First pass: create category map
  categories.forEach(cat => {
    categoryMap[cat._id.toString()] = { ...cat.toObject(), children: [] };
  });

  // Second pass: build tree structure
  categories.forEach(cat => {
    if (cat.parent) {
      const parent = categoryMap[cat.parent.toString()];
      if (parent) {
        parent.children.push(categoryMap[cat._id.toString()]);
      }
    } else {
      rootCategories.push(categoryMap[cat._id.toString()]);
    }
  });

  return rootCategories;
};

// Static method to get breadcrumb path
CategorySchema.statics.getBreadcrumb = async function(categoryId) {
  const category = await this.findById(categoryId);
  if (!category) return [];

  const breadcrumb = [category];
  let currentCategory = category;

  while (currentCategory.parent) {
    currentCategory = await this.findById(currentCategory.parent);
    if (currentCategory) {
      breadcrumb.unshift(currentCategory);
    } else {
      break;
    }
  }

  return breadcrumb;
};

// Instance method to get all descendant categories
CategorySchema.methods.getDescendants = async function() {
  const descendants = [];
  
  const findChildren = async (parentId) => {
    const children = await this.constructor.find({ parent: parentId, isActive: true });
    for (const child of children) {
      descendants.push(child);
      await findChildren(child._id);
    }
  };

  await findChildren(this._id);
  return descendants;
};

// Instance method to update product count
CategorySchema.methods.updateProductCount = async function() {
  const Product = mongoose.model('Product');
  const count = await Product.countDocuments({ 
    category: this._id, 
    status: 'active' 
  });
  this.productCount = count;
  return this.save();
};

// Post-save middleware to update parent product counts
CategorySchema.post('save', async function() {
  if (this.parent) {
    const parent = await this.constructor.findById(this.parent);
    if (parent) {
      await parent.updateProductCount();
    }
  }
});

export default mongoose.models.Category || mongoose.model('Category', CategorySchema);

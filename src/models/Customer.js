import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const customerSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email address'
    ]
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false // Don't include password in queries by default
  },
  phone: {
    type: String,
    trim: true,
    match: [/^\+[1-9]\d{1,14}$/, 'Please enter a valid phone number']
  },
  customerType: {
    type: String,
    enum: ['final_customer', 'retail_customer', 'wholesale_customer'],
    default: 'final_customer'
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: {
    type: String,
    select: false
  },
  emailVerificationExpires: {
    type: Date,
    select: false
  },
  passwordResetToken: {
    type: String,
    select: false
  },
  passwordResetExpires: {
    type: Date,
    select: false
  },
  lastLogin: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  refreshTokens: [{
    token: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 604800 // 7 days in seconds
    },
    userAgent: String,
    ipAddress: String
  }],
  // Personal information
  dateOfBirth: Date,
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'prefer_not_to_say']
  },
  // Address information
  addresses: [{
    type: {
      type: String,
      enum: ['home', 'work', 'other', 'shipping', 'billing', 'both'], // Support both old and new types
      required: true
    },
    label: String, // e.g., "Home", "Office", "Warehouse"
    company: String,
    street: {
      type: String,
      required: true
    },
    street2: String, // Apartment, suite, etc.
    city: {
      type: String,
      required: true
    },
    state: String,
    postalCode: {
      type: String,
      required: true
    },
    country: {
      type: String,
      default: 'Morocco',
      required: true
    },
    phone: String,
    isDefault: {
      type: Boolean,
      default: false
    },
    instructions: String // Delivery instructions
  }],
  // Order and spending information
  totalOrders: {
    type: Number,
    default: 0
  },
  totalSpent: {
    type: Number,
    default: 0
  },
  loyaltyPoints: {
    type: Number,
    default: 0
  },
  preferredCategories: [String],
  lastOrderDate: Date,
  averageOrderValue: {
    type: Number,
    default: 0
  },
  // Business customer specific fields (for retail/wholesale)
  businessInfo: {
    companyName: String,
    taxId: String,
    businessType: String,
    discountTier: { type: Number, default: 0 }, // Percentage discount
    creditLimit: { type: Number, default: 0 },
    paymentTerms: { type: Number, default: 0 }, // Days
    qrCode: String // Unique QR code for retail/wholesale
  },
  // Profile preferences
  preferences: {
    language: {
      type: String,
      enum: ['fr', 'ar', 'en'],
      default: 'fr'
    },
    currency: {
      type: String,
      enum: ['MAD', 'EUR', 'USD'],
      default: 'MAD'
    },
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      sms: {
        type: Boolean,
        default: false
      }
    }
  },
  // Track who created/updated customers (for admin panel)
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // Reference to system users (admin/manager/sales)
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // Reference to system users (admin/manager/sales)
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function(doc, ret) {
      delete ret.password;
      delete ret.refreshTokens;
      delete ret.emailVerificationToken;
      delete ret.emailVerificationExpires;
      delete ret.passwordResetToken;
      delete ret.passwordResetExpires;
      return ret;
    }
  }
});

// Indexes for better performance
customerSchema.index({ email: 1 }, { unique: true });
customerSchema.index({ isActive: 1 });
customerSchema.index({ customerType: 1 });
customerSchema.index({ createdAt: -1 });
customerSchema.index({ totalOrders: -1 });
customerSchema.index({ totalSpent: -1 });
customerSchema.index({ loyaltyPoints: -1 });
customerSchema.index({ lastOrderDate: -1 });
customerSchema.index({ createdBy: 1 });
customerSchema.index({ updatedBy: 1 });
customerSchema.index({ 'businessInfo.companyName': 1 });
customerSchema.index({ 'businessInfo.taxId': 1 });
customerSchema.index({ 'businessInfo.qrCode': 1 }, { unique: true, sparse: true });
customerSchema.index({ 'addresses.type': 1 });
customerSchema.index({ 'addresses.isDefault': 1 });

// Pre-save middleware to hash password
customerSchema.pre('save', async function(next) {
  // Only run this function if password was modified
  if (!this.isModified('password')) return next();

  try {
    // Hash password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);
    next();
  } catch (error) {
    next(error);
  }
});

// Instance method to check password
customerSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Instance method to get full name
customerSchema.methods.getFullName = function() {
  return `${this.firstName} ${this.lastName}`;
};

// Instance method to generate QR code for business customers
customerSchema.methods.generateQRCode = function() {
  if (this.customerType === 'retail_customer' || this.customerType === 'wholesale_customer') {
    // Generate unique QR code: CUSTOMER_TYPE_TIMESTAMP_RANDOM
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    const type = this.customerType === 'retail_customer' ? 'RT' : 'WS';
    return `${type}_${timestamp}_${random}`;
  }
  return null;
};

// Instance method to add refresh token
customerSchema.methods.addRefreshToken = function(token, userAgent, ipAddress) {
  // Remove old tokens (keep only last 5)
  if (this.refreshTokens.length >= 5) {
    this.refreshTokens = this.refreshTokens.slice(-4);
  }
  
  this.refreshTokens.push({
    token,
    userAgent,
    ipAddress
  });
};

// Instance method to remove refresh token
customerSchema.methods.removeRefreshToken = function(token) {
  this.refreshTokens = this.refreshTokens.filter(rt => rt.token !== token);
};

// Static method to find customer with refresh token
customerSchema.statics.findByRefreshToken = function(token) {
  return this.findOne({
    'refreshTokens.token': token,
    isActive: true
  });
};

// Virtual for customer's full name
customerSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Ensure virtual fields are serialized
// Add virtual field for frontend compatibility
customerSchema.virtual('isVerified').get(function() {
  return this.isEmailVerified;
});

customerSchema.set('toJSON', { virtuals: true });

const Customer = mongoose.models.Customer || mongoose.model('Customer', customerSchema);

export default Customer;

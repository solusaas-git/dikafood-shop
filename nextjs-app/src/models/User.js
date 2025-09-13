import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
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
    trim: true
  },
  role: {
    type: String,
    enum: ['customer', 'admin', 'manager', 'sales'],
    default: 'customer'
  },
  userType: {
    type: String,
    enum: ['system', 'customer'],
    default: 'customer'
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
  // Profile information
  profile: {
    avatar: String,
    bio: String,
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
    }
  },
  // Address information
  addresses: [{
    type: {
      type: String,
      enum: ['home', 'work', 'other'],
      default: 'home'
    },
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: {
      type: String,
      default: 'Morocco'
    },
    isDefault: {
      type: Boolean,
      default: false
    }
  }],
  // Customer-specific fields
  customerInfo: {
    customerType: {
      type: String,
      enum: ['final_customer', 'retail_customer', 'wholesale_customer'],
      default: 'final_customer'
    },
    dateOfBirth: Date,
    gender: {
      type: String,
      enum: ['male', 'female', 'other', 'prefer_not_to_say']
    },
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
      paymentTerms: { type: Number, default: 0 } // Days
    }
  },
  // System user specific fields
  systemInfo: {
    department: {
      type: String,
      enum: ['administration', 'sales', 'marketing', 'operations', 'customer_service']
    },
    permissions: [{
      resource: String,
      actions: [String] // ['create', 'read', 'update', 'delete']
    }],
    employeeId: String,
    hireDate: Date,
    supervisor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    lastLoginIP: String,
    failedLoginAttempts: {
      type: Number,
      default: 0
    },
    accountLockedUntil: Date
  },
  // Track who created/updated users (for admin panel)
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
  toJSON: {
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
userSchema.index({ email: 1 }, { unique: true }); // Explicit unique index for email
userSchema.index({ isActive: 1 });
userSchema.index({ role: 1 });
userSchema.index({ userType: 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ 'customerInfo.totalOrders': -1 });
userSchema.index({ 'customerInfo.totalSpent': -1 });
userSchema.index({ 'customerInfo.customerType': 1 });
userSchema.index({ 'systemInfo.department': 1 });
userSchema.index({ 'systemInfo.employeeId': 1 });
userSchema.index({ createdBy: 1 });
userSchema.index({ updatedBy: 1 });

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
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
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Instance method to get full name
userSchema.methods.getFullName = function() {
  return `${this.firstName} ${this.lastName}`;
};

// Instance method to add refresh token
userSchema.methods.addRefreshToken = function(token, userAgent, ipAddress) {
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
userSchema.methods.removeRefreshToken = function(token) {
  this.refreshTokens = this.refreshTokens.filter(rt => rt.token !== token);
};

// Static method to find user with refresh token
userSchema.statics.findByRefreshToken = function(token) {
  return this.findOne({
    'refreshTokens.token': token,
    isActive: true
  });
};

// Virtual for user's age (if birthDate is added later)
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Ensure virtual fields are serialized
userSchema.set('toJSON', { virtuals: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;

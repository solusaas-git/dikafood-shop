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
    unique: true,
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
  role: {
    type: String,
    enum: ['user', 'admin', 'manager'],
    default: 'user'
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
  }]
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
userSchema.index({ email: 1 });
userSchema.index({ isActive: 1 });
userSchema.index({ role: 1 });
userSchema.index({ createdAt: -1 });

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

const User = mongoose.model('User', userSchema);

export default User;

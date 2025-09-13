import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  // Session identification
  sessionId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  
  // User information (null for guest sessions)
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    sparse: true, // Allows null values for guest sessions
    index: true
  },
  
  // Session type
  sessionType: {
    type: String,
    enum: ['guest', 'authenticated'],
    required: true,
    default: 'guest',
    index: true
  },
  
  // Authentication tokens
  accessToken: {
    type: String,
    sparse: true // Only for authenticated sessions
  },
  
  refreshToken: {
    type: String,
    sparse: true, // Only for authenticated sessions
    index: true
  },
  
  // Session metadata
  userAgent: {
    type: String,
    default: ''
  },
  
  ipAddress: {
    type: String,
    required: true,
    index: true
  },
  
  // Device/browser fingerprinting
  deviceInfo: {
    browser: String,
    os: String,
    device: String,
    fingerprint: String // Unique device identifier
  },
  
  // Geographic information
  location: {
    country: String,
    region: String,
    city: String,
    timezone: String
  },
  
  // Session status
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  
  // Expiration management
  expiresAt: {
    type: Date,
    required: true
  },
  
  // Activity tracking
  lastActivity: {
    type: Date,
    default: Date.now,
    index: true
  },
  
  // Login tracking (for authenticated sessions)
  loginAt: {
    type: Date,
    sparse: true
  },
  
  logoutAt: {
    type: Date,
    sparse: true
  },
  
  // Security tracking
  failedLoginAttempts: {
    type: Number,
    default: 0
  },
  
  // Cart and session data
  cartData: {
    items: [{
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      variantId: String,
      quantity: Number,
      addedAt: { type: Date, default: Date.now }
    }],
    lastUpdated: Date
  },
  
  // Session preferences
  preferences: {
    language: {
      type: String,
      default: 'fr'
    },
    currency: {
      type: String,
      default: 'MAD'
    },
    theme: {
      type: String,
      default: 'light'
    }
  },
  
  // Tracking for analytics
  analytics: {
    pageViews: { type: Number, default: 0 },
    totalTimeSpent: { type: Number, default: 0 }, // in seconds
    referrer: String,
    utm: {
      source: String,
      medium: String,
      campaign: String,
      term: String,
      content: String
    }
  },
  
  // Session termination reason
  terminationReason: {
    type: String,
    enum: ['logout', 'timeout', 'expired', 'security', 'admin_revoked'],
    sparse: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true }
});

// TTL Index - Automatically delete expired sessions
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Compound indexes for efficient queries
sessionSchema.index({ userId: 1, isActive: 1 });
sessionSchema.index({ sessionType: 1, isActive: 1 });
sessionSchema.index({ refreshToken: 1, isActive: 1 });
sessionSchema.index({ ipAddress: 1, lastActivity: -1 });
sessionSchema.index({ createdAt: -1 }); // For recent sessions

// Instance Methods

// Update last activity
sessionSchema.methods.updateActivity = function() {
  this.lastActivity = new Date();
  return this.save();
};

// Terminate session
sessionSchema.methods.terminate = function(reason = 'logout') {
  this.isActive = false;
  this.logoutAt = new Date();
  this.terminationReason = reason;
  return this.save();
};

// Convert guest session to authenticated
sessionSchema.methods.authenticate = function(userId, accessToken, refreshToken) {
  this.userId = userId;
  this.sessionType = 'authenticated';
  this.accessToken = accessToken;
  this.refreshToken = refreshToken;
  this.loginAt = new Date();
  this.lastActivity = new Date();
  return this.save();
};

// Add item to cart
sessionSchema.methods.addToCart = function(productId, variantId, quantity = 1) {
  if (!this.cartData.items) {
    this.cartData.items = [];
  }
  
  // Check if item already exists
  const existingItemIndex = this.cartData.items.findIndex(
    item => item.productId.toString() === productId.toString() && 
            item.variantId === variantId
  );
  
  if (existingItemIndex > -1) {
    // Update existing item
    this.cartData.items[existingItemIndex].quantity += quantity;
  } else {
    // Add new item
    this.cartData.items.push({
      productId,
      variantId,
      quantity,
      addedAt: new Date()
    });
  }
  
  this.cartData.lastUpdated = new Date();
  this.lastActivity = new Date();
  return this.save();
};

// Remove item from cart
sessionSchema.methods.removeFromCart = function(productId, variantId) {
  if (!this.cartData.items) return this.save();
  
  this.cartData.items = this.cartData.items.filter(
    item => !(item.productId.toString() === productId.toString() && 
              item.variantId === variantId)
  );
  
  this.cartData.lastUpdated = new Date();
  this.lastActivity = new Date();
  return this.save();
};

// Clear cart
sessionSchema.methods.clearCart = function() {
  this.cartData.items = [];
  this.cartData.lastUpdated = new Date();
  this.lastActivity = new Date();
  return this.save();
};

// Static Methods

// Create guest session
sessionSchema.statics.createGuestSession = function(sessionId, ipAddress, userAgent = '', expirationHours = 24) {
  const expiresAt = new Date(Date.now() + expirationHours * 60 * 60 * 1000);
  
  return this.create({
    sessionId,
    sessionType: 'guest',
    ipAddress,
    userAgent,
    expiresAt,
    lastActivity: new Date()
  });
};

// Create authenticated session
sessionSchema.statics.createAuthenticatedSession = function(sessionId, userId, accessToken, refreshToken, ipAddress, userAgent = '', expirationDays = 7) {
  const expiresAt = new Date(Date.now() + expirationDays * 24 * 60 * 60 * 1000);
  
  return this.create({
    sessionId,
    userId,
    sessionType: 'authenticated',
    accessToken,
    refreshToken,
    ipAddress,
    userAgent,
    expiresAt,
    loginAt: new Date(),
    lastActivity: new Date()
  });
};

// Find active session by sessionId
sessionSchema.statics.findActiveSession = function(sessionId) {
  return this.findOne({
    sessionId,
    isActive: true,
    expiresAt: { $gt: new Date() }
  }).populate('userId', 'firstName lastName email role userType');
};

// Find sessions by user
sessionSchema.statics.findUserSessions = function(userId, activeOnly = true) {
  const query = { userId };
  if (activeOnly) {
    query.isActive = true;
    query.expiresAt = { $gt: new Date() };
  }
  
  return this.find(query).sort({ lastActivity: -1 });
};

// Find session by refresh token
sessionSchema.statics.findByRefreshToken = function(refreshToken) {
  return this.findOne({
    refreshToken,
    isActive: true,
    expiresAt: { $gt: new Date() }
  }).populate('userId', 'firstName lastName email role userType');
};

// Cleanup expired sessions (manual cleanup)
sessionSchema.statics.cleanupExpiredSessions = function() {
  return this.deleteMany({
    $or: [
      { expiresAt: { $lt: new Date() } },
      { isActive: false, updatedAt: { $lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } // Remove inactive sessions older than 7 days
    ]
  });
};

// Revoke all user sessions (for security)
sessionSchema.statics.revokeAllUserSessions = function(userId, reason = 'security') {
  return this.updateMany(
    { userId, isActive: true },
    {
      isActive: false,
      logoutAt: new Date(),
      terminationReason: reason
    }
  );
};

// Get session analytics
sessionSchema.statics.getSessionAnalytics = function(userId = null, days = 30) {
  const matchStage = {
    createdAt: { $gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000) }
  };
  
  if (userId) {
    matchStage.userId = new mongoose.Types.ObjectId(userId);
  }
  
  return this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalSessions: { $sum: 1 },
        authenticatedSessions: {
          $sum: { $cond: [{ $eq: ['$sessionType', 'authenticated'] }, 1, 0] }
        },
        guestSessions: {
          $sum: { $cond: [{ $eq: ['$sessionType', 'guest'] }, 1, 0] }
        },
        averageSessionDuration: {
          $avg: {
            $divide: [
              { $subtract: ['$lastActivity', '$createdAt'] },
              1000 // Convert to seconds
            ]
          }
        },
        uniqueUsers: { $addToSet: '$userId' },
        topCountries: { $addToSet: '$location.country' },
        topBrowsers: { $addToSet: '$deviceInfo.browser' }
      }
    }
  ]);
};

// Virtual for session duration
sessionSchema.virtual('duration').get(function() {
  const end = this.logoutAt || this.lastActivity || new Date();
  return Math.floor((end - this.createdAt) / 1000); // Duration in seconds
});

// Virtual for is expired
sessionSchema.virtual('isExpired').get(function() {
  return new Date() > this.expiresAt;
});

const Session = mongoose.models.Session || mongoose.model('Session', sessionSchema);

export default Session;

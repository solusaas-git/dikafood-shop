import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Verify JWT token middleware
export const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '') || req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required',
        code: 'TOKEN_REQUIRED'
      });
    }

    try {
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Find the user
      const user = await User.findById(decoded.userId).select('+refreshTokens');
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found',
          code: 'USER_NOT_FOUND'
        });
      }

      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Account is deactivated',
          code: 'ACCOUNT_DEACTIVATED'
        });
      }

      // Add user to request object
      req.user = user;
      req.userId = user._id;
      
      next();
    } catch (jwtError) {
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token expired',
          code: 'TOKEN_EXPIRED'
        });
      } else if (jwtError.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          message: 'Invalid token',
          code: 'INVALID_TOKEN'
        });
      } else {
        throw jwtError;
      }
    }
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({
      success: false,
      message: 'Authentication failed',
      code: 'AUTH_ERROR'
    });
  }
};

// Optional authentication - doesn't fail if no token
export const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '') || req.cookies.token;

    if (!token) {
      return next();
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);
      
      if (user && user.isActive) {
        req.user = user;
        req.userId = user._id;
      }
    } catch (jwtError) {
      // Silently ignore token errors for optional auth
      console.log('Optional auth token error:', jwtError.message);
    }

    next();
  } catch (error) {
    console.error('Optional authentication error:', error);
    next(); // Continue even on error
  }
};

// Role-based authorization middleware
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
        code: 'AUTH_REQUIRED'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
        code: 'INSUFFICIENT_PERMISSIONS'
      });
    }

    next();
  };
};

// Middleware to check if user owns resource or is admin
export const authorizeOwnerOrAdmin = (resourceUserIdField = 'userId') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
        code: 'AUTH_REQUIRED'
      });
    }

    // Admin can access any resource
    if (req.user.role === 'admin') {
      return next();
    }

    // Check if user owns the resource
    const resourceUserId = req.params[resourceUserIdField] || req.body[resourceUserIdField];
    
    if (req.user._id.toString() === resourceUserId) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: 'Access denied',
      code: 'ACCESS_DENIED'
    });
  };
};

// Middleware to validate refresh token
export const validateRefreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.body.refreshToken || req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token required',
        code: 'REFRESH_TOKEN_REQUIRED'
      });
    }

    try {
      // Verify refresh token
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      
      // Find user with this refresh token
      const user = await User.findByRefreshToken(refreshToken);
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid refresh token',
          code: 'INVALID_REFRESH_TOKEN'
        });
      }

      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Account is deactivated',
          code: 'ACCOUNT_DEACTIVATED'
        });
      }

      req.user = user;
      req.refreshToken = refreshToken;
      next();
    } catch (jwtError) {
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Refresh token expired',
          code: 'REFRESH_TOKEN_EXPIRED'
        });
      } else {
        return res.status(401).json({
          success: false,
          message: 'Invalid refresh token',
          code: 'INVALID_REFRESH_TOKEN'
        });
      }
    }
  } catch (error) {
    console.error('Refresh token validation error:', error);
    return res.status(500).json({
      success: false,
      message: 'Token validation failed',
      code: 'TOKEN_VALIDATION_ERROR'
    });
  }
};

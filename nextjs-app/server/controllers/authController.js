import { validationResult } from 'express-validator';
import User from '../models/User.js';
import { generateTokens } from '../utils/jwt.js';
import crypto from 'crypto';

// Helper function to set secure cookies
const setTokenCookies = (res, accessToken, refreshToken) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  };

  res.cookie('token', accessToken, cookieOptions);
  res.cookie('refreshToken', refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
};

// Helper function to clear cookies
const clearTokenCookies = (res) => {
  res.clearCookie('token');
  res.clearCookie('refreshToken');
};

// Register new user
export const register = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
        code: 'VALIDATION_ERROR'
      });
    }

    const { firstName, lastName, email, password, phone } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists',
        code: 'USER_EXISTS'
      });
    }

    // Create new user
    const user = new User({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password,
      phone
    });

    // Generate email verification token
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');
    user.emailVerificationToken = emailVerificationToken;
    user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    await user.save();

    // Generate tokens
    const tokens = generateTokens(user._id);
    
    // Add refresh token to user
    const userAgent = req.get('User-Agent');
    const ipAddress = req.ip;
    user.addRefreshToken(tokens.refreshToken, userAgent, ipAddress);
    await user.save();

    // Set secure cookies
    setTokenCookies(res, tokens.accessToken, tokens.refreshToken);

    // Remove sensitive data before sending response
    const userResponse = user.toJSON();

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: userResponse,
        tokens: {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          expiresIn: tokens.accessTokenExpiry
        }
      }
    });

    // TODO: Send verification email (implement email service)
    console.log(`📧 Email verification token for ${email}: ${emailVerificationToken}`);

  } catch (error) {
    console.error('Registration error:', error);
    
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists',
        code: 'DUPLICATE_EMAIL'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Registration failed',
      code: 'REGISTRATION_ERROR'
    });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
        code: 'VALIDATION_ERROR'
      });
    }

    const { email, password, rememberMe } = req.body;

    // Find user by email and include password for comparison
    const user = await User.findOne({ 
      email: email.toLowerCase(),
      isActive: true 
    }).select('+password +refreshTokens');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
        code: 'INVALID_CREDENTIALS'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
        code: 'INVALID_CREDENTIALS'
      });
    }

    // Generate tokens
    const tokens = generateTokens(user._id);
    
    // Add refresh token to user
    const userAgent = req.get('User-Agent');
    const ipAddress = req.ip;
    user.addRefreshToken(tokens.refreshToken, userAgent, ipAddress);
    
    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Set secure cookies (longer expiry if remember me)
    const cookieMaxAge = rememberMe ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      maxAge: cookieMaxAge
    };

    res.cookie('token', tokens.accessToken, cookieOptions);
    res.cookie('refreshToken', tokens.refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000 // Refresh token always 7 days
    });

    // Remove sensitive data before sending response
    const userResponse = user.toJSON();

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: userResponse,
        tokens: {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          expiresIn: tokens.accessTokenExpiry
        }
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      code: 'LOGIN_ERROR'
    });
  }
};

// Logout user
export const logout = async (req, res) => {
  try {
    const refreshToken = req.body.refreshToken || req.cookies.refreshToken;

    if (refreshToken && req.user) {
      // Remove the refresh token from user's tokens array
      req.user.removeRefreshToken(refreshToken);
      await req.user.save();
    }

    // Clear cookies
    clearTokenCookies(res);

    res.json({
      success: true,
      message: 'Logout successful'
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Logout failed',
      code: 'LOGOUT_ERROR'
    });
  }
};

// Logout from all devices
export const logoutAll = async (req, res) => {
  try {
    if (req.user) {
      // Clear all refresh tokens
      req.user.refreshTokens = [];
      await req.user.save();
    }

    // Clear cookies
    clearTokenCookies(res);

    res.json({
      success: true,
      message: 'Logged out from all devices'
    });

  } catch (error) {
    console.error('Logout all error:', error);
    res.status(500).json({
      success: false,
      message: 'Logout failed',
      code: 'LOGOUT_ERROR'
    });
  }
};

// Refresh access token
export const refreshToken = async (req, res) => {
  try {
    const user = req.user;
    const oldRefreshToken = req.refreshToken;

    // Generate new tokens
    const tokens = generateTokens(user._id);

    // Replace old refresh token with new one
    user.removeRefreshToken(oldRefreshToken);
    const userAgent = req.get('User-Agent');
    const ipAddress = req.ip;
    user.addRefreshToken(tokens.refreshToken, userAgent, ipAddress);
    await user.save();

    // Set new cookies
    setTokenCookies(res, tokens.accessToken, tokens.refreshToken);

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        tokens: {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          expiresIn: tokens.accessTokenExpiry
        }
      }
    });

  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({
      success: false,
      message: 'Token refresh failed',
      code: 'TOKEN_REFRESH_ERROR'
    });
  }
};

// Get current user profile
export const getProfile = async (req, res) => {
  try {
    const user = req.user;

    res.json({
      success: true,
      message: 'Profile retrieved successfully',
      data: {
        user: user.toJSON()
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve profile',
      code: 'PROFILE_ERROR'
    });
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
        code: 'VALIDATION_ERROR'
      });
    }

    const user = req.user;
    const { firstName, lastName, phone, profile } = req.body;

    // Update allowed fields
    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (phone !== undefined) user.phone = phone;
    
    // Update profile fields
    if (profile) {
      if (profile.bio !== undefined) {
        if (!user.profile) user.profile = {};
        user.profile.bio = profile.bio;
      }
      if (profile.preferences) {
        if (!user.profile) user.profile = {};
        if (!user.profile.preferences) user.profile.preferences = {};
        
        if (profile.preferences.language) {
          user.profile.preferences.language = profile.preferences.language;
        }
        if (profile.preferences.currency) {
          user.profile.preferences.currency = profile.preferences.currency;
        }
        if (profile.preferences.notifications) {
          user.profile.preferences.notifications = {
            ...user.profile.preferences.notifications,
            ...profile.preferences.notifications
          };
        }
      }
    }

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: user.toJSON()
      }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      code: 'PROFILE_UPDATE_ERROR'
    });
  }
};

// Change password
export const changePassword = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
        code: 'VALIDATION_ERROR'
      });
    }

    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password +refreshTokens');

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect',
        code: 'INVALID_CURRENT_PASSWORD'
      });
    }

    // Update password
    user.password = newPassword;
    
    // Clear all refresh tokens (force re-login on all devices)
    user.refreshTokens = [];
    
    await user.save();

    // Clear cookies
    clearTokenCookies(res);

    res.json({
      success: true,
      message: 'Password changed successfully. Please login again.'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change password',
      code: 'PASSWORD_CHANGE_ERROR'
    });
  }
};

// Verify email
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token',
        code: 'INVALID_VERIFICATION_TOKEN'
      });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Email verified successfully'
    });

  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Email verification failed',
      code: 'EMAIL_VERIFICATION_ERROR'
    });
  }
};

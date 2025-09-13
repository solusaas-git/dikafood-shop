import express from 'express';
import { body } from 'express-validator';
import {
  register,
  login,
  logout,
  logoutAll,
  refreshToken,
  getProfile,
  updateProfile,
  changePassword,
  verifyEmail
} from '../controllers/authController.js';
import { authenticate, validateRefreshToken } from '../middleware/auth.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// Rate limiting for auth endpoints
const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later',
    code: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const strictAuthRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs for sensitive operations
  message: {
    success: false,
    message: 'Too many attempts, please try again later',
    code: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Validation rules
const registerValidation = [
  body('firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  
  body('lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .isLength({ min: 8, max: 30 })
    .withMessage('Password must be between 8 and 30 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  
  body('phone')
    .optional()
    .matches(/^\+[1-9]\d{1,14}$/)
    .withMessage('Please provide a valid phone number in international format')
];

const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

const updateProfileValidation = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  
  body('phone')
    .optional()
    .matches(/^\+[1-9]\d{1,14}$/)
    .withMessage('Please provide a valid phone number in international format'),
  
  body('profile.bio')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Bio must not exceed 500 characters'),
  
  body('profile.preferences.language')
    .optional()
    .isIn(['fr', 'ar', 'en'])
    .withMessage('Language must be one of: fr, ar, en'),
  
  body('profile.preferences.currency')
    .optional()
    .isIn(['MAD', 'EUR', 'USD'])
    .withMessage('Currency must be one of: MAD, EUR, USD')
];

const changePasswordValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  
  body('newPassword')
    .isLength({ min: 8, max: 30 })
    .withMessage('New password must be between 8 and 30 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/)
    .withMessage('New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Password confirmation does not match new password');
      }
      return true;
    })
];

// Public routes
router.post('/register', authRateLimit, registerValidation, register);
router.post('/login', authRateLimit, loginValidation, login);
router.post('/refresh', validateRefreshToken, refreshToken);
router.get('/verify-email/:token', verifyEmail);

// Protected routes (require authentication)
router.use(authenticate); // All routes below this middleware require authentication

router.post('/logout', logout);
router.post('/logout-all', logoutAll);
router.get('/me', getProfile);
router.put('/profile', updateProfileValidation, updateProfile);
router.put('/change-password', strictAuthRateLimit, changePasswordValidation, changePassword);

export default router;

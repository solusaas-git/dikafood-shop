import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { loginWithSession } from '../../../../lib/sessionAuth.js';
import { body, validationResult } from 'express-validator';

// Validation rules
const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
  body('rememberMe')
    .optional()
    .isBoolean()
    .withMessage('Remember me must be a boolean')
];

async function validateLoginRequest(req) {
  const data = await req.json();
  const errors = [];
  
  // Manual validation (since express-validator doesn't work directly with Next.js)
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push({ field: 'email', message: 'Please provide a valid email address' });
  }
  
  if (!data.password || data.password.length < 8) {
    errors.push({ field: 'password', message: 'Password must be at least 8 characters long' });
  }
  
  return { data, errors };
}

export async function POST(req) {
  try {
    // Validate request
    const { data, errors } = await validateLoginRequest(req);
    
    if (errors.length > 0) {
      return NextResponse.json({
        success: false,
        message: 'Validation failed',
        errors,
        code: 'VALIDATION_ERROR'
      }, { status: 400 });
    }

    const { email, password, rememberMe = false } = data;

    // Authenticate user and create session
    const result = await loginWithSession(email, password, rememberMe, req);
    
    // Create response
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      data: {
        user: result.user,
        sessionId: result.sessionId,
        tokens: {
          accessToken: result.tokens.accessToken,
          refreshToken: result.tokens.refreshToken,
          expiresIn: 3600 // 1 hour in seconds
        }
      }
    });

    // Set secure cookies
    const cookieMaxAge = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000; // 30 days or 7 days
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: cookieMaxAge,
      path: '/'
    };

    // Set session cookies
    response.cookies.set('sessionId', result.sessionId, cookieOptions);
    response.cookies.set('accessToken', result.tokens.accessToken, {
      ...cookieOptions,
      maxAge: 60 * 60 * 1000 // 1 hour for access token
    });
    response.cookies.set('refreshToken', result.tokens.refreshToken, cookieOptions);

    return response;

  } catch (error) {
    console.error('Session login error:', error);
    
    // Handle specific errors
    if (error.message === 'Invalid email or password') {
      return NextResponse.json({
        success: false,
        message: 'Invalid email or password',
        code: 'INVALID_CREDENTIALS'
      }, { status: 401 });
    }

    return NextResponse.json({
      success: false,
      message: 'Login failed',
      code: 'LOGIN_ERROR'
    }, { status: 500 });
  }
}

// GET endpoint to check session status
export async function GET(req) {
  try {
    const { authenticateWithSession } = await import('../../../../lib/sessionAuth.js');
    
    const result = await authenticateWithSession(req);
    
    return NextResponse.json({
      success: true,
      data: {
        user: result.user,
        sessionId: result.sessionId,
        isAuthenticated: true
      }
    });
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Not authenticated',
      isAuthenticated: false
    }, { status: 401 });
  }
}

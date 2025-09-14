import { NextResponse } from 'next/server';
import { loginWithSession } from '../../../../lib/sessionAuth.js';

// Validation function for login
async function validateLoginRequest(req) {
  const data = await req.json();
  const errors = [];
  
  // Email validation
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  if (!data.email || !emailRegex.test(data.email)) {
    errors.push({ field: 'email', message: 'Please provide a valid email address' });
  }
  
  // Password validation
  if (!data.password) {
    errors.push({ field: 'password', message: 'Password is required' });
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
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      maxAge: cookieMaxAge
    };

    // Set session cookies
    response.cookies.set('sessionId', result.sessionId, cookieOptions);
    response.cookies.set('token', result.tokens.accessToken, {
      ...cookieOptions,
      maxAge: 60 * 60 * 1000 // 1 hour for access token
    });
    response.cookies.set('refreshToken', result.tokens.refreshToken, cookieOptions);

    return response;

  } catch (error) {
    console.error('Login error:', error);
    
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
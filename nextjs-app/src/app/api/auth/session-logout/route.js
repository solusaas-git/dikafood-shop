import { NextResponse } from 'next/server';
import { logoutWithSession } from '../../../../lib/sessionAuth.js';

export async function POST(req) {
  try {
    // Logout and terminate session
    await logoutWithSession(req);

    // Create response
    const response = NextResponse.json({
      success: true,
      message: 'Logout successful'
    });

    // Clear all auth-related cookies
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0 // Immediately expire
    };

    response.cookies.set('sessionId', '', cookieOptions);
    response.cookies.set('accessToken', '', cookieOptions);
    response.cookies.set('refreshToken', '', cookieOptions);

    return response;

  } catch (error) {
    console.error('Session logout error:', error);
    
    // Even if there's an error, we should clear cookies and return success
    // because the user wants to log out
    const response = NextResponse.json({
      success: true,
      message: 'Logout completed'
    });

    // Clear cookies anyway
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0
    };

    response.cookies.set('sessionId', '', cookieOptions);
    response.cookies.set('accessToken', '', cookieOptions);
    response.cookies.set('refreshToken', '', cookieOptions);

    return response;
  }
}

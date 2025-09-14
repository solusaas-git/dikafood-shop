import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { refreshTokenWithSession } from '../../../../lib/sessionAuth.js';

export async function POST(req) {
  try {
    // Get refresh token from cookies or body
    const cookieStore = await cookies();
    const refreshTokenFromCookie = cookieStore.get('refreshToken')?.value;
    
    let refreshTokenFromBody;
    try {
      const body = await req.json();
      refreshTokenFromBody = body.refreshToken;
    } catch (e) {
      // Body is optional, we can use cookie token
    }

    const refreshToken = refreshTokenFromCookie || refreshTokenFromBody;

    if (!refreshToken) {
      return NextResponse.json({
        success: false,
        message: 'Refresh token is required',
        code: 'REFRESH_TOKEN_REQUIRED'
      }, { status: 401 });
    }

    // Refresh tokens using session
    const result = await refreshTokenWithSession(refreshToken);

    // Create response
    const response = NextResponse.json({
      success: true,
      message: 'Tokens refreshed successfully',
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

    // Update cookies with new tokens
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    };

    response.cookies.set('sessionId', result.sessionId, cookieOptions);
    response.cookies.set('token', result.tokens.accessToken, {
      ...cookieOptions,
      maxAge: 60 * 60 * 1000 // 1 hour for access token
    });
    response.cookies.set('refreshToken', result.tokens.refreshToken, cookieOptions);

    return response;

  } catch (error) {
    console.error('Token refresh error:', error);

    // Clear potentially invalid cookies
    const response = NextResponse.json({
      success: false,
      message: 'Token refresh failed',
      code: 'REFRESH_FAILED'
    }, { status: 401 });

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      maxAge: 0
    };

    response.cookies.set('sessionId', '', cookieOptions);
    response.cookies.set('token', '', cookieOptions);
    response.cookies.set('refreshToken', '', cookieOptions);

    return response;
  }
}
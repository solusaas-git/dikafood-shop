import { NextResponse } from 'next/server';
import { authenticate } from '../../../../lib/auth.js';

export async function GET(req) {
  try {
    // Authenticate user and get fresh data from database
    const user = await authenticate(req);

    return NextResponse.json({
      success: true,
      message: 'Profile refreshed successfully',
      data: {
        user: user.toJSON()
      }
    });

  } catch (error) {
    console.error('Refresh profile error:', error);
    
    const status = error.code === 'TOKEN_EXPIRED' ? 401 : 
                   error.code === 'INVALID_TOKEN' ? 401 : 500;
    const code = error.code || 'REFRESH_ERROR';
    
    return NextResponse.json({
      success: false,
      message: error.message || 'Failed to refresh profile',
      code
    }, { status });
  }
}

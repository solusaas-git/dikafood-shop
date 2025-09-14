import { NextResponse } from 'next/server';
import { authenticate } from '../../../../lib/auth.js';

export async function GET(req) {
  try {
    // Authenticate user
    const user = await authenticate(req);

    return NextResponse.json({
      success: true,
      message: 'Profile retrieved successfully',
      data: {
        user: user.toJSON()
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    
    const status = error.code === 'TOKEN_EXPIRED' ? 401 : 
                   error.code === 'INVALID_TOKEN' ? 401 : 500;
    const code = error.code || 'PROFILE_ERROR';
    
    return NextResponse.json({
      success: false,
      message: error.message || 'Failed to retrieve profile',
      code
    }, { status });
  }
}

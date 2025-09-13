import { NextResponse } from 'next/server';
import { authenticate } from '../../../../lib/auth.js';

/**
 * GET /api/auth/verify - Verify JWT token and return user info
 * Used by admin pages to validate authentication status
 */
export async function GET(req) {
  try {
    // Authenticate user using existing auth middleware
    const user = await authenticate(req);
    
    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'Authentication required'
      }, { status: 401 });
    }

    // Check if user has admin-level access
    const adminRoles = ['admin', 'manager', 'sales'];
    if (!adminRoles.includes(user.role)) {
      return NextResponse.json({
        success: false,
        message: 'Insufficient permissions for admin access'
      }, { status: 403 });
    }

    // Return user info (without sensitive data)
    return NextResponse.json({
      success: true,
      message: 'Token verified successfully',
      data: {
        user: {
          _id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          isActive: user.isActive,
          lastLogin: user.lastLogin
        }
      }
    });

  } catch (error) {
    console.error('Token verification error:', error);
    
    // Handle specific JWT errors
    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json({
        success: false,
        message: 'Invalid token'
      }, { status: 401 });
    }
    
    if (error.name === 'TokenExpiredError') {
      return NextResponse.json({
        success: false,
        message: 'Token expired'
      }, { status: 401 });
    }
    
    return NextResponse.json({
      success: false,
      message: 'Token verification failed'
    }, { status: 401 });
  }
}

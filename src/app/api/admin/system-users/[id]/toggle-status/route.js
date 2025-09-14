import { NextResponse } from 'next/server';
import { authenticate } from '../../../../../../lib/auth.js';
import User from '../../../../../../models/User.js';
import connectDB from '../../../../../../lib/database.js';

export async function PATCH(request, { params }) {
  try {
    const user = await authenticate(request);
    
    // Check if user has admin privileges
    if (user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Access denied. Admin privileges required.' },
        { status: 403 }
      );
    }

    await connectDB();
    const { id } = await params;
    const body = await request.json();

    // Prevent admin from disabling themselves
    if (user._id.toString() === id) {
      return NextResponse.json(
        { success: false, message: 'You cannot disable your own account' },
        { status: 400 }
      );
    }

    // Find the system user
    const systemUser = await User.findOne({ 
      _id: id, 
      $or: [
        { userType: 'system' },
        { 
          userType: { $exists: false }, 
          role: { $in: ['admin', 'manager', 'sales'] } 
        }
      ]
    });

    if (!systemUser) {
      return NextResponse.json(
        { success: false, message: 'System user not found' },
        { status: 404 }
      );
    }

    // Update the user status
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { isActive: body.isActive },
      { new: true, runValidators: true }
    )
    .select('-password -refreshTokens -emailVerificationToken -passwordResetToken')
    .populate('systemInfo.supervisor', 'firstName lastName email')
    .lean();

    return NextResponse.json({
      success: true,
      data: { user: updatedUser },
      message: `User ${body.isActive ? 'enabled' : 'disabled'} successfully`
    });

  } catch (error) {
    console.error('Toggle system user status error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update user status' },
      { status: 500 }
    );
  }
}

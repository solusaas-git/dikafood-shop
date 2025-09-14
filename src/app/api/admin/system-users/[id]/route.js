import { NextResponse } from 'next/server';
import { authenticate } from '../../../../../lib/auth.js';
import User from '../../../../../models/User.js';
import connectDB from '../../../../../lib/database.js';

export async function GET(request, { params }) {
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

    const systemUser = await User.findOne({ 
      _id: id, 
      $or: [
        { userType: 'system' },
        { 
          userType: { $exists: false }, 
          role: { $in: ['admin', 'manager', 'sales'] } 
        }
      ]
    })
      .select('-password -refreshTokens -emailVerificationToken -passwordResetToken')
      .populate('systemInfo.supervisor', 'firstName lastName email')
      .lean();

    if (!systemUser) {
      return NextResponse.json(
        { success: false, message: 'System user not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { user: systemUser }
    });

  } catch (error) {
    console.error('Get system user error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch system user' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
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

    // Find the system user
    const existingUser = await User.findOne({ 
      _id: id, 
      $or: [
        { userType: 'system' },
        { 
          userType: { $exists: false }, 
          role: { $in: ['admin', 'manager', 'sales'] } 
        }
      ]
    });
    if (!existingUser) {
      return NextResponse.json(
        { success: false, message: 'System user not found' },
        { status: 404 }
      );
    }

    // Check if email is being changed and if it already exists
    if (body.email && body.email !== existingUser.email) {
      const emailExists = await User.findOne({ 
        email: body.email.toLowerCase(),
        _id: { $ne: id }
      });
      if (emailExists) {
        return NextResponse.json(
          { success: false, message: 'User with this email already exists' },
          { status: 409 }
        );
      }
    }

    // Prepare update data
    const updateData = {
      ...body,
      email: body.email ? body.email.toLowerCase() : existingUser.email
    };

    // Handle system info updates
    if (body.systemInfo) {
      updateData.systemInfo = {
        ...existingUser.systemInfo,
        ...body.systemInfo
      };
    }

    // Update the user
    const updatedUser = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
    .select('-password -refreshTokens -emailVerificationToken -passwordResetToken')
    .populate('systemInfo.supervisor', 'firstName lastName email')
    .lean();

    return NextResponse.json({
      success: true,
      message: 'System user updated successfully',
      data: { user: updatedUser }
    });

  } catch (error) {
    console.error('Update system user error:', error);
    
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Failed to update system user' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
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

    // Prevent admin from deleting themselves
    if (user._id.toString() === id) {
      return NextResponse.json(
        { success: false, message: 'You cannot delete your own account' },
        { status: 400 }
      );
    }

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

    // Check if this user is a supervisor for other users
    const superviseesCount = await User.countDocuments({
      'systemInfo.supervisor': id,
      $or: [
        { userType: 'system' },
        { 
          userType: { $exists: false }, 
          role: { $in: ['admin', 'manager', 'sales'] } 
        }
      ]
    });

    if (superviseesCount > 0) {
      return NextResponse.json(
        { success: false, message: 'Cannot delete user who is a supervisor. Please reassign their supervisees first.' },
        { status: 400 }
      );
    }

    // Soft delete by setting isActive to false
    await User.findByIdAndUpdate(id, { 
      isActive: false,
      email: `deleted_${Date.now()}_${systemUser.email}` // Prevent email conflicts
    });

    return NextResponse.json({
      success: true,
      message: 'System user deleted successfully'
    });

  } catch (error) {
    console.error('Delete system user error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete system user' },
      { status: 500 }
    );
  }
}

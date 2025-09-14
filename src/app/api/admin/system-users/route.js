import { NextResponse } from 'next/server';
import { authenticate } from '../../../../lib/auth.js';
import User from '../../../../models/User.js';
import connectDB from '../../../../lib/database.js';

export async function GET(request) {
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

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role') || '';
    const department = searchParams.get('department') || '';
    const isActive = searchParams.get('isActive');

    // Build query for system users (including existing users without userType field)
    const query = {
      $and: [
        {
          $or: [
            { userType: 'system' },
            { 
              userType: { $exists: false }, 
              role: { $in: ['admin', 'manager', 'sales'] } 
            }
          ]
        }
      ]
    };

    // Add search conditions
    if (search) {
      query.$and.push({
        $or: [
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { 'systemInfo.employeeId': { $regex: search, $options: 'i' } }
        ]
      });
    }

    if (role && role !== 'all') {
      query.$and.push({ role: role });
    }

    if (department && department !== 'all') {
      query.$and.push({ 'systemInfo.department': department });
    }

    if (isActive !== null && isActive !== undefined && isActive !== '') {
      query.$and.push({ isActive: isActive === 'true' });
    }

    // Get total count
    const total = await User.countDocuments(query);

    // Get users with pagination
    const users = await User.find(query)
      .select('-password -refreshTokens -emailVerificationToken -passwordResetToken')
      .populate('systemInfo.supervisor', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: page,
          totalPages,
          totalUsers: total,
          hasNextPage,
          hasPrevPage,
          limit
        }
      }
    });

  } catch (error) {
    console.error('Get system users error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch system users' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
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

    const body = await request.json();
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      role,
      department,
      employeeId,
      permissions,
      supervisor,
      hireDate
    } = body;

    // Validation
    if (!firstName || !lastName || !email || !password || !role) {
      return NextResponse.json(
        { success: false, message: 'First name, last name, email, password, and role are required' },
        { status: 400 }
      );
    }

    // Validate role for system users
    if (!['admin', 'manager', 'sales'].includes(role)) {
      return NextResponse.json(
        { success: false, message: 'Invalid role for system user' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Create system user
    const userData = {
      firstName,
      lastName,
      email: email.toLowerCase(),
      password,
      role,
      userType: 'system',
      isEmailVerified: true, // System users are pre-verified
      systemInfo: {
        permissions: permissions || [],
        supervisor: supervisor || null,
        hireDate: hireDate ? new Date(hireDate) : new Date(),
        failedLoginAttempts: 0
      }
    };

    // Only add phone if provided and not empty
    if (phone && phone.trim() && phone !== '') {
      userData.phone = phone;
    }

    // Only add department if provided and not empty
    if (department && department.trim()) {
      userData.systemInfo.department = department;
    }

    // Only add employeeId if provided and not empty
    if (employeeId && employeeId.trim()) {
      userData.systemInfo.employeeId = employeeId;
    }

    const newUser = new User(userData);

    await newUser.save();

    // Remove sensitive information before sending response
    const userResponse = newUser.toJSON();
    delete userResponse.password;

    return NextResponse.json({
      success: true,
      message: 'System user created successfully',
      data: { user: userResponse }
    }, { status: 201 });

  } catch (error) {
    console.error('Create system user error:', error);
    
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Failed to create system user' },
      { status: 500 }
    );
  }
}

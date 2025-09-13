import { NextResponse } from 'next/server';
import { authenticate } from '../../../../lib/auth.js';
import User from '../../../../models/User.js';
import connectDB from '../../../../lib/database.js';

export async function POST(request) {
  try {
    const user = await authenticate(request);
    
    // Only allow admin to run migration
    if (user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Access denied. Admin privileges required.' },
        { status: 403 }
      );
    }

    await connectDB();

    // Update existing users without userType field
    const systemUsersUpdate = await User.updateMany(
      { 
        userType: { $exists: false },
        role: { $in: ['admin', 'manager', 'sales'] }
      },
      { 
        $set: { 
          userType: 'system',
          systemInfo: {
            department: 'administration', // Default department
            employeeId: '',
            permissions: [],
            hireDate: new Date(),
            failedLoginAttempts: 0
          }
        }
      }
    );

    // Update existing users without userType field to be customers
    const customerUsersUpdate = await User.updateMany(
      { 
        userType: { $exists: false },
        role: { $nin: ['admin', 'manager', 'sales'] }
      },
      { 
        $set: { 
          userType: 'customer',
          role: 'customer', // Ensure role is customer
          customerInfo: {
            totalOrders: 0,
            totalSpent: 0,
            loyaltyPoints: 0,
            preferredCategories: [],
            averageOrderValue: 0
          }
        }
      }
    );

    return NextResponse.json({
      success: true,
      message: 'User migration completed successfully',
      data: {
        systemUsersUpdated: systemUsersUpdate.modifiedCount,
        customerUsersUpdated: customerUsersUpdate.modifiedCount
      }
    });

  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to migrate users' },
      { status: 500 }
    );
  }
}

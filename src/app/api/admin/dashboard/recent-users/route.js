import { NextResponse } from 'next/server';
import { authenticate } from '../../../../../lib/auth';
import connectDB from '../../../../../lib/database';

export async function GET(request) {
  try {
    const user = await authenticate(request);

    if (!['admin', 'manager'].includes(user.role)) {
      return NextResponse.json(
        { success: false, message: 'Access denied' },
        { status: 403 }
      );
    }

    await connectDB();

    // Import models
    const Customer = (await import('../../../../../models/Customer')).default;
    const Order = (await import('../../../../../models/Order')).default;

    // Get recent customers (last 10)
    const recentCustomers = await Customer.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('firstName lastName phone addresses createdAt isActive customerType');

    // Get order counts for each customer
    const customerIds = recentCustomers.map(customer => customer._id);
    const orderCounts = await Order.aggregate([
      { $match: { customer: { $in: customerIds } } },
      { $group: { _id: '$customer', count: { $sum: 1 } } }
    ]);

    // Create a map for quick lookup
    const orderCountMap = orderCounts.reduce((acc, item) => {
      acc[item._id.toString()] = item.count;
      return acc;
    }, {});

    // Format the data for the dashboard
    const formattedUsers = recentCustomers.map(customer => {
      // Extract city from default address
      let city = 'N/A';
      if (customer.addresses && customer.addresses.length > 0) {
        // Find default address first
        const defaultAddress = customer.addresses.find(addr => addr.isDefault);
        if (defaultAddress && defaultAddress.city) {
          city = defaultAddress.city;
        } else if (customer.addresses[0] && customer.addresses[0].city) {
          // Fallback to first address if no default
          city = customer.addresses[0].city;
        }
      }

      return {
        id: customer._id.toString(),
        name: `${customer.firstName || ''} ${customer.lastName || ''}`.trim() || 'Unknown',
        phone: customer.phone || 'N/A',
        city: city,
        joinDate: customer.createdAt,
        status: customer.isActive !== false ? 'active' : 'inactive',
        orders: orderCountMap[customer._id.toString()] || 0
      };
    });

    return NextResponse.json({
      success: true,
      data: formattedUsers
    });

  } catch (error) {
    console.error('Recent users error:', error);
    
    // Handle authentication errors
    if (error.message?.includes('Authentication') || error.message?.includes('No authentication')) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

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

    // Import Order model
    const Order = (await import('../../../../../models/Order')).default;

    // Get recent orders (last 10)
    const recentOrders = await Order.find()
      .populate('customer', 'firstName lastName email addresses')
      .sort({ createdAt: -1 })
      .limit(10)
      .select('orderNumber customer total status createdAt items paymentMethod');

    // Format the data for the dashboard
    const formattedOrders = recentOrders.map(order => {
      // Safely calculate items count
      let itemsCount = 0;
      if (order.items && Array.isArray(order.items)) {
        itemsCount = order.items.reduce((total, item) => total + (item.quantity || 0), 0);
      }

      // Extract city from customer's default address
      let customerCity = '';
      if (order.customer && order.customer.addresses && order.customer.addresses.length > 0) {
        // Find default address first
        const defaultAddress = order.customer.addresses.find(addr => addr.isDefault);
        if (defaultAddress && defaultAddress.city) {
          customerCity = defaultAddress.city;
        } else if (order.customer.addresses[0] && order.customer.addresses[0].city) {
          // Fallback to first address if no default
          customerCity = order.customer.addresses[0].city;
        }
      }

      // Format customer name with city
      const customerName = `${order.customer?.firstName || ''} ${order.customer?.lastName || ''}`.trim() || 'Guest';
      const customerWithCity = customerCity ? `${customerName} (${customerCity})` : customerName;

      return {
        id: order.orderNumber,
        customer: customerWithCity,
        email: order.customer?.email || '',
        total: order.total,
        status: order.status,
        date: order.createdAt,
        items: itemsCount,
        paymentMethod: order.paymentMethod
      };
    });

    return NextResponse.json({
      success: true,
      data: formattedOrders
    });

  } catch (error) {
    console.error('Recent orders error:', error);
    
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

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
    const Order = (await import('../../../../../models/Order')).default;
    const Product = (await import('../../../../../models/Product')).default;
    const Customer = (await import('../../../../../models/Customer')).default;

    // Get current date for filtering
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // Parallel queries for better performance
    const [
      totalOrders,
      totalRevenue,
      totalProducts,
      totalCustomers,
      currentMonthOrders,
      lastMonthOrders,
      currentMonthRevenue,
      lastMonthRevenue,
      currentMonthCustomers,
      lastMonthCustomers
    ] = await Promise.all([
      // Total counts
      Order.countDocuments(),
      Order.aggregate([
        { $group: { _id: null, total: { $sum: '$total' } } }
      ]).then(result => result[0]?.total || 0),
      Product.countDocuments(),
      Customer.countDocuments(),
      
      // Current month metrics for growth calculation
      Order.countDocuments({ createdAt: { $gte: startOfMonth } }),
      Order.countDocuments({ 
        createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } 
      }),
      Order.aggregate([
        { $match: { createdAt: { $gte: startOfMonth } } },
        { $group: { _id: null, total: { $sum: '$total' } } }
      ]).then(result => result[0]?.total || 0),
      Order.aggregate([
        { $match: { createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } } },
        { $group: { _id: null, total: { $sum: '$total' } } }
      ]).then(result => result[0]?.total || 0),
      
      // Customer growth calculation
      Customer.countDocuments({ createdAt: { $gte: startOfMonth } }),
      Customer.countDocuments({ 
        createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } 
      })
    ]);

    // Calculate growth percentages
    const calculateGrowth = (current, previous) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - previous) / previous) * 100);
    };

    const ordersGrowth = calculateGrowth(currentMonthOrders, lastMonthOrders);
    const revenueGrowth = calculateGrowth(currentMonthRevenue, lastMonthRevenue);
    const customersGrowth = calculateGrowth(currentMonthCustomers, lastMonthCustomers);

    const stats = {
      totalOrders,
      totalRevenue,
      totalProducts,
      totalUsers: totalCustomers, // Rename for consistency with frontend
      growth: {
        orders: ordersGrowth,
        revenue: revenueGrowth,
        products: 0, // Products don't change frequently
        users: customersGrowth // Now using real customer growth
      }
    };

    return NextResponse.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Dashboard stats error:', error);
    
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

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

    const url = new URL(request.url);
    const period = url.searchParams.get('period') || '7days';

    await connectDB();

    // Import Order model
    const Order = (await import('../../../../../models/Order')).default;

    let salesData = [];
    const now = new Date();

    if (period === '7days') {
      // Get sales for last 7 days
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const salesByDay = {};

      // Initialize with 0 for all days
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dayName = days[date.getDay()];
        salesByDay[dayName] = 0;
      }

      // Get actual sales data
      const startDate = new Date(now);
      startDate.setDate(startDate.getDate() - 6);
      startDate.setHours(0, 0, 0, 0);

      const orders = await Order.find({
        createdAt: { $gte: startDate },
        status: { $in: ['confirmed', 'processing', 'shipped', 'delivered'] }
      }).select('total createdAt');

      // Aggregate by day
      orders.forEach(order => {
        const orderDate = new Date(order.createdAt);
        const dayName = days[orderDate.getDay()];
        salesByDay[dayName] += order.total;
      });

      // Convert to array format
      salesData = Object.entries(salesByDay).map(([day, sales]) => ({
        day,
        sales: Math.round(sales)
      }));

    } else if (period === '30days') {
      // Get sales for last 30 days (grouped by week)
      const weeks = [];
      for (let i = 3; i >= 0; i--) {
        const weekStart = new Date(now);
        weekStart.setDate(weekStart.getDate() - (i * 7) - 6);
        weekStart.setHours(0, 0, 0, 0);
        
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);
        weekEnd.setHours(23, 59, 59, 999);

        weeks.push({
          label: `Week ${4 - i}`,
          start: weekStart,
          end: weekEnd,
          sales: 0
        });
      }

      // Get orders for the last 30 days
      const startDate = new Date(now);
      startDate.setDate(startDate.getDate() - 29);
      startDate.setHours(0, 0, 0, 0);

      const orders = await Order.find({
        createdAt: { $gte: startDate },
        status: { $in: ['confirmed', 'processing', 'shipped', 'delivered'] }
      }).select('total createdAt');

      // Aggregate by week
      orders.forEach(order => {
        const orderDate = new Date(order.createdAt);
        const week = weeks.find(w => orderDate >= w.start && orderDate <= w.end);
        if (week) {
          week.sales += order.total;
        }
      });

      salesData = weeks.map(week => ({
        day: week.label,
        sales: Math.round(week.sales)
      }));

    } else if (period === '3months') {
      // Get sales for last 3 months
      const months = [];
      for (let i = 2; i >= 0; i--) {
        const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthName = monthDate.toLocaleDateString('en-US', { month: 'short' });
        months.push({
          label: monthName,
          start: new Date(monthDate.getFullYear(), monthDate.getMonth(), 1),
          end: new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0, 23, 59, 59, 999),
          sales: 0
        });
      }

      // Get orders for the last 3 months
      const startDate = months[0].start;

      const orders = await Order.find({
        createdAt: { $gte: startDate },
        status: { $in: ['confirmed', 'processing', 'shipped', 'delivered'] }
      }).select('total createdAt');

      // Aggregate by month
      orders.forEach(order => {
        const orderDate = new Date(order.createdAt);
        const month = months.find(m => orderDate >= m.start && orderDate <= m.end);
        if (month) {
          month.sales += order.total;
        }
      });

      salesData = months.map(month => ({
        day: month.label,
        sales: Math.round(month.sales)
      }));
    }

    return NextResponse.json({
      success: true,
      data: {
        period,
        sales: salesData
      }
    });

  } catch (error) {
    console.error('Sales data error:', error);
    
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

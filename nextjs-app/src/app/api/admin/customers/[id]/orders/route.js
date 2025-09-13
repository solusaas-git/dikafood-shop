import { NextResponse } from 'next/server';
import { authenticate } from '../../../../../../lib/auth.js';
import Order from '../../../../../../models/Order.js';
import connectDB from '../../../../../../lib/database.js';
import mongoose from 'mongoose';

export async function GET(request, { params }) {
  try {
    const user = await authenticate(request);
    
    // Check if user has appropriate privileges
    if (!['admin', 'manager', 'sales'].includes(user.role)) {
      return NextResponse.json(
        { success: false, message: 'Access denied. Insufficient privileges.' },
        { status: 403 }
      );
    }

    await connectDB();
    const { id } = await params;

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Build query
    const query = { customer: id };
    
    if (status && status !== 'all') {
      query.status = status;
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Get total count
    const total = await Order.countDocuments(query);

    // Get orders with pagination
    const orders = await Order.find(query)
      .populate('customer', 'firstName lastName email customerType')
      .populate('createdBy', 'firstName lastName email')
      .populate('updatedBy', 'firstName lastName email')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    // Calculate statistics
    const stats = await Order.aggregate([
      { $match: { customer: new mongoose.Types.ObjectId(id) } },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$total' },
          averageOrderValue: { $avg: '$total' },
          pendingOrders: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
          },
          completedOrders: {
            $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] }
          }
        }
      }
    ]);

    return NextResponse.json({
      success: true,
      data: {
        orders,
        pagination: {
          currentPage: page,
          totalPages,
          totalOrders: total,
          hasNextPage,
          hasPrevPage,
          limit
        },
        stats: stats[0] || {
          totalOrders: 0,
          totalRevenue: 0,
          averageOrderValue: 0,
          pendingOrders: 0,
          completedOrders: 0
        }
      }
    });

  } catch (error) {
    console.error('Get customer orders error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch customer orders' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import { authenticate } from '../../../../lib/auth.js';
import connectDB from '../../../../lib/database.js';
import Order from '../../../../models/Order.js';

export async function GET(req) {
  try {
    await connectDB();
    
    // Authenticate user
    const user = await authenticate(req);
    
    // Parse query parameters
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const status = url.searchParams.get('status');
    const sortBy = url.searchParams.get('sortBy') || 'createdAt';
    const sortOrder = url.searchParams.get('sortOrder') === 'asc' ? 1 : -1;

    // Build query
    const query = { customer: user._id };
    if (status) {
      query.status = status;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Fetch orders with optimized query
    const [orders, totalOrders] = await Promise.all([
      Order.find(query)
        .select('orderNumber status total subtotal items.productName items.variant items.quantity createdAt') // Only select needed fields
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit)
        .lean(), // Use lean for better performance
      Order.countDocuments(query)
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(totalOrders / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json({
      success: true,
      message: 'Orders retrieved successfully',
      data: orders,
      pagination: {
        currentPage: page,
        totalPages,
        totalOrders,
        limit,
        hasNextPage,
        hasPrevPage
      }
    });

  } catch (error) {
    console.error('Get customer orders error:', error);
    
    const status = error.message === 'Authentication failed' ? 401 : 500;
    
    return NextResponse.json({
      success: false,
      message: error.message || 'Failed to retrieve orders'
    }, { status });
  }
}

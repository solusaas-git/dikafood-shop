import { NextResponse } from 'next/server';
import { authenticate } from '../../../../lib/auth.js';
import Order from '../../../../models/Order.js';
import Customer from '../../../../models/Customer.js';
import connectDB from '../../../../lib/database.js';
import { body, validationResult } from 'express-validator';

// GET /api/admin/orders - Get all orders with filtering and pagination
export async function GET(request) {
  try {
    const user = await authenticate(request);

    if (!['admin', 'manager', 'sales'].includes(user.role)) {
      return NextResponse.json(
        { success: false, message: 'Access denied. Insufficient privileges.' },
        { status: 403 }
      );
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const paymentStatus = searchParams.get('paymentStatus');
    const dateRange = searchParams.get('dateRange');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Build filter object
    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (paymentStatus) {
      filter.paymentStatus = paymentStatus;
    }

    // Date range filtering
    if (dateRange) {
      const now = new Date();
      let startDate, endDate;

      switch (dateRange) {
        case 'today':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
          break;
        case 'yesterday':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
          endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case 'last7days':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          endDate = now;
          break;
        case 'last30days':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          endDate = now;
          break;
        case 'thismonth':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
          break;
        case 'lastmonth':
          startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          endDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
      }

      if (startDate && endDate) {
        filter.createdAt = { $gte: startDate, $lt: endDate };
      }
    }

    // Search functionality
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      
      // Get customers matching the search term
      const matchingCustomers = await Customer.find({
        $or: [
          { firstName: searchRegex },
          { lastName: searchRegex },
          { email: searchRegex }
        ]
      }).select('_id');

      const customerIds = matchingCustomers.map(customer => customer._id);

      filter.$or = [
        { orderNumber: searchRegex },
        { trackingNumber: searchRegex },
        { customer: { $in: customerIds } }
      ];
    }

    // Get orders with pagination
    const skip = (page - 1) * limit;
    const orders = await Order.find(filter)
      .populate('customer', 'firstName lastName email customerType')
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Calculate itemsCount for each order since .lean() doesn't include virtuals
    const ordersWithItemsCount = orders.map(order => {
      let itemsCount = 0;
      if (order.items && Array.isArray(order.items)) {
        itemsCount = order.items.reduce((total, item) => {
          const quantity = item.quantity || 0;
          return total + quantity;
        }, 0);
      }
      
      // Debug logging to see what's happening
      console.log(`Order ${order.orderNumber}: items array length = ${order.items?.length || 0}, itemsCount = ${itemsCount}`);
      if (order.items?.length > 0) {
        console.log(`First item:`, order.items[0]);
      }
      
      return {
        ...order,
        itemsCount
      };
    });

    // Get total count for pagination
    const totalOrders = await Order.countDocuments(filter);
    const totalPages = Math.ceil(totalOrders / limit);

    // Calculate statistics
    const stats = await calculateOrderStats();

    return NextResponse.json({
      success: true,
      data: {
        orders: ordersWithItemsCount,
        pagination: {
          currentPage: page,
          totalPages,
          totalOrders,
          limit
        },
        stats
      }
    });

  } catch (error) {
    console.error('Get orders error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// POST /api/admin/orders - Create new order
export async function POST(request) {
  try {
    const user = await authenticate(request);

    if (!['admin', 'manager', 'sales'].includes(user.role)) {
      return NextResponse.json(
        { success: false, message: 'Access denied. Insufficient privileges.' },
        { status: 403 }
      );
    }

    await connectDB();

    const body = await request.json();

    // Validate required fields
    const {
      customer,
      items,
      shippingAddress,
      billingAddress,
      paymentMethod,
      subtotal,
      tax = 0,
      shipping = 0,
      discount = 0,
      total,
      notes,
      estimatedDeliveryDate
    } = body;

    if (!customer || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Customer and items are required' },
        { status: 400 }
      );
    }

    if (!shippingAddress || !paymentMethod || !subtotal || !total) {
      return NextResponse.json(
        { success: false, message: 'Missing required order information' },
        { status: 400 }
      );
    }

    // Verify customer exists
    const customerDoc = await Customer.findById(customer);
    if (!customerDoc) {
      return NextResponse.json(
        { success: false, message: 'Customer not found' },
        { status: 404 }
      );
    }

    // Create order
    const newOrder = new Order({
      customer,
      items,
      subtotal,
      tax,
      shipping,
      discount,
      total,
      shippingAddress,
      billingAddress: billingAddress || shippingAddress, // Use shipping as billing if not provided
      paymentMethod,
      notes,
      estimatedDeliveryDate: estimatedDeliveryDate ? new Date(estimatedDeliveryDate) : undefined,
      createdBy: user._id,
      updatedBy: user._id
    });

    await newOrder.save();

    // Populate the customer data for response
    await newOrder.populate('customer', 'firstName lastName email customerType');

    return NextResponse.json({
      success: true,
      data: newOrder,
      message: 'Order created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create order' },
      { status: 500 }
    );
  }
}

// Helper function to calculate order statistics
async function calculateOrderStats() {
  try {
    const stats = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { 
            $sum: { 
              $cond: [
                { $ne: ['$status', 'cancelled'] }, 
                '$total', 
                0
              ] 
            } 
          },
          pendingOrders: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
          },
          processingOrders: {
            $sum: { $cond: [{ $eq: ['$status', 'processing'] }, 1, 0] }
          },
          deliveredOrders: {
            $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] }
          }
        }
      }
    ]);

    const result = stats[0] || {
      totalOrders: 0,
      totalRevenue: 0,
      pendingOrders: 0,
      processingOrders: 0,
      deliveredOrders: 0
    };

    // Calculate average order value
    result.averageOrderValue = result.totalOrders > 0 ? result.totalRevenue / result.totalOrders : 0;

    return result;
  } catch (error) {
    console.error('Error calculating order stats:', error);
    return {
      totalOrders: 0,
      totalRevenue: 0,
      pendingOrders: 0,
      processingOrders: 0,
      deliveredOrders: 0,
      averageOrderValue: 0
    };
  }
}

import { NextResponse } from 'next/server';
import { authenticate } from '../../../../../lib/auth.js';
import connectDB from '../../../../../lib/database.js';
import Order from '../../../../../models/Order.js';
import User from '../../../../../models/User.js';

export async function GET(req, { params }) {
  try {
    await connectDB();
    
    // Authenticate user
    const user = await authenticate(req);
    
    const { orderId } = await params;
    
    if (!orderId) {
      return NextResponse.json({
        success: false,
        message: 'Order ID is required'
      }, { status: 400 });
    }

    console.log('📦 Fetching order details:', {
      orderId,
      customerId: user._id
    });

    // Find order by ID and ensure it belongs to the authenticated customer
    const order = await Order.findOne({
      _id: orderId,
      customer: user._id
    })
    .select('-__v -updatedAt') // Exclude unnecessary fields
    .populate('customer', 'firstName lastName email')
    .populate({
      path: 'items.product', 
      select: 'name slug images',
      options: { lean: true } // Use lean for better performance
    })
    .populate({
      path: 'history.updatedBy',
      select: 'firstName lastName role',
      model: 'User',
      options: { lean: true }
    })
    .lean();

    if (!order) {
      console.log('📦 Order not found or access denied:', {
        orderId,
        customerId: user._id
      });
      return NextResponse.json({
        success: false,
        message: 'Order not found'
      }, { status: 404 });
    }

    console.log('📦 Order details found:', {
      orderNumber: order.orderNumber,
      status: order.status,
      total: order.total,
      itemsCount: order.items?.length || 0,
      firstItem: order.items?.[0] ? {
        productName: order.items[0].productName,
        variant: order.items[0].variant,
        productImages: order.items[0].product?.images
      } : null
    });

    return NextResponse.json({
      success: true,
      message: 'Order details retrieved successfully',
      data: order
    });

  } catch (error) {
    console.error('Get order details error:', error);
    
    const status = error.message === 'Authentication failed' ? 401 : 500;
    
    return NextResponse.json({
      success: false,
      message: error.message || 'Failed to retrieve order details'
    }, { status });
  }
}

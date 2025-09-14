import { NextResponse } from 'next/server';
import Order from '../../../../../models/Order.js';
import Customer from '../../../../../models/Customer.js';
import DeliveryMethod from '../../../../../models/DeliveryMethod.js';
import connectDB from '../../../../../lib/database.js';

export async function GET(req, { params }) {
  try {
    await connectDB();
    
    const { token } = await params;
    
    if (!token || typeof token !== 'string') {
      return NextResponse.json({
        success: false,
        message: 'Invalid confirmation token',
        code: 'INVALID_TOKEN'
      }, { status: 400 });
    }
    
    // Find order by confirmation token
    let order;
    try {
      order = await Order.findOne({ confirmationToken: token })
        .populate('customer', 'firstName lastName email phone customerType')
        .populate('items.product', 'name slug images')
        .populate('deliveryMethod', 'name description type price estimatedTime logo');
    } catch (populateError) {
      console.log('⚠️ Populate error, trying without deliveryMethod:', populateError.message);
      // Fallback: try without deliveryMethod populate if it fails
      order = await Order.findOne({ confirmationToken: token })
        .populate('customer', 'firstName lastName email phone customerType')
        .populate('items.product', 'name slug images');
    }
    
    
    if (!order) {
      return NextResponse.json({
        success: false,
        message: 'Order not found or invalid confirmation token',
        code: 'ORDER_NOT_FOUND'
      }, { status: 404 });
    }
    
    // Return order details
    return NextResponse.json({
      success: true,
      data: {
        order: order,
        orderNumber: order.orderNumber,
        confirmationToken: order.confirmationToken,
        customer: {
          id: order.customer._id,
          email: order.customer.email,
          firstName: order.customer.firstName,
          lastName: order.customer.lastName,
          phone: order.customer.phone
        }
      },
      message: 'Order retrieved successfully'
    }, { status: 200 });
    
  } catch (error) {
    console.error('Get order by confirmation token error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to retrieve order',
      code: 'FETCH_ERROR'
    }, { status: 500 });
  }
}

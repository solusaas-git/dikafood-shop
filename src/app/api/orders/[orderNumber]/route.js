import { NextResponse } from 'next/server';
import Order from '../../../../models/Order.js';
import Customer from '../../../../models/Customer.js';
import connectDB from '../../../../lib/database.js';

// GET /api/orders/[orderNumber] - Track order by order number (Customer-facing)
export async function GET(request, { params }) {
  try {
    await connectDB();
    const { orderNumber } = await params;

    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const phone = searchParams.get('phone');

    if (!orderNumber) {
      return NextResponse.json(
        { success: false, message: 'Order number is required' },
        { status: 400 }
      );
    }

    // For customer order tracking, require email or phone for security
    if (!email && !phone) {
      return NextResponse.json(
        { success: false, message: 'Customer email or phone is required for order tracking' },
        { status: 400 }
      );
    }

    // Find customer first
    const customer = await Customer.findOne({
      $or: [
        email ? { email: email.toLowerCase() } : null,
        phone ? { phone: phone } : null
      ].filter(Boolean)
    });

    if (!customer) {
      return NextResponse.json(
        { success: false, message: 'Customer not found' },
        { status: 404 }
      );
    }

    // Find order
    const order = await Order.findOne({
      orderNumber: orderNumber,
      customer: customer._id
    })
    .populate('customer', 'firstName lastName email phone customerType')
    .lean();

    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }

    // Return customer-friendly order data (hide sensitive admin info)
    const customerOrderData = {
      _id: order._id,
      orderNumber: order.orderNumber,
      status: order.status,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      items: order.items,
      subtotal: order.subtotal,
      tax: order.tax,
      shipping: order.shipping,
      discount: order.discount,
      total: order.total,
      shippingAddress: order.shippingAddress,
      estimatedDeliveryDate: order.estimatedDeliveryDate,
      actualDeliveryDate: order.actualDeliveryDate,
      trackingNumber: order.trackingNumber,
      carrier: order.carrier,
      customerNotes: order.customerNotes,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      // Customer-friendly history (hide admin notes)
      history: order.history?.filter(h => !h.note?.includes('admin') && !h.note?.includes('internal')).map(h => ({
        status: h.status,
        note: h.note,
        timestamp: h.timestamp
      })) || [],
      customer: {
        firstName: order.customer.firstName,
        lastName: order.customer.lastName,
        email: order.customer.email
      }
    };

    return NextResponse.json({
      success: true,
      data: customerOrderData
    });

  } catch (error) {
    console.error('Track order error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to track order' },
      { status: 500 }
    );
  }
}

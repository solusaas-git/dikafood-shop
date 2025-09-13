import { NextResponse } from 'next/server';
import { authenticate } from '../../../../../lib/auth.js';
import Order from '../../../../../models/Order.js';
import Customer from '../../../../../models/Customer.js';
import connectDB from '../../../../../lib/database.js';
import mongoose from 'mongoose';

// GET /api/admin/orders/[id] - Get single order
export async function GET(request, { params }) {
  try {
    const user = await authenticate(request);

    if (!['admin', 'manager', 'sales'].includes(user.role)) {
      return NextResponse.json(
        { success: false, message: 'Access denied. Insufficient privileges.' },
        { status: 403 }
      );
    }

    await connectDB();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: 'Invalid order ID' }, { status: 400 });
    }

    const order = await Order.findById(id)
      .populate('customer', 'firstName lastName email phone customerType businessInfo addresses')
      .populate('createdBy', 'firstName lastName email')
      .populate('updatedBy', 'firstName lastName email')
      .lean();

    if (!order) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: order
    });

  } catch (error) {
    console.error('Get order error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/orders/[id] - Update order
export async function PUT(request, { params }) {
  try {
    const user = await authenticate(request);

    if (!['admin', 'manager', 'sales'].includes(user.role)) {
      return NextResponse.json(
        { success: false, message: 'Access denied. Insufficient privileges.' },
        { status: 403 }
      );
    }

    await connectDB();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: 'Invalid order ID' }, { status: 400 });
    }

    const body = await request.json();
    const existingOrder = await Order.findById(id);

    if (!existingOrder) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }

    // Prepare update data
    const updateData = {
      ...body,
      updatedBy: user._id
    };

    // Handle date fields
    if (body.estimatedDeliveryDate) {
      updateData.estimatedDeliveryDate = new Date(body.estimatedDeliveryDate);
    }
    if (body.actualDeliveryDate) {
      updateData.actualDeliveryDate = new Date(body.actualDeliveryDate);
    }
    if (body.paymentDate) {
      updateData.paymentDate = new Date(body.paymentDate);
    }

    // Add history entry if status is changing
    if (body.status && body.status !== existingOrder.status) {
      const historyEntry = {
        status: body.status,
        note: body.statusNote || `Status changed from ${existingOrder.status} to ${body.status}`,
        timestamp: new Date(),
        updatedBy: user._id
      };

      updateData.$push = { history: historyEntry };

      // If order is delivered, set actual delivery date
      if (body.status === 'delivered' && !body.actualDeliveryDate) {
        updateData.actualDeliveryDate = new Date();
      }

      // If payment status should change with order status
      if (body.status === 'delivered' && existingOrder.paymentStatus === 'pending') {
        updateData.paymentStatus = 'paid';
        updateData.paymentDate = new Date();
      }
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('customer', 'firstName lastName email phone customerType businessInfo addresses')
     .populate('createdBy', 'firstName lastName email')
     .populate('updatedBy', 'firstName lastName email');

    return NextResponse.json({
      success: true,
      data: updatedOrder,
      message: 'Order updated successfully'
    });

  } catch (error) {
    console.error('Update order error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update order' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/orders/[id] - Delete order
export async function DELETE(request, { params }) {
  try {
    const user = await authenticate(request);

    if (!['admin', 'manager'].includes(user.role)) {
      return NextResponse.json(
        { success: false, message: 'Access denied. Only admins and managers can delete orders.' },
        { status: 403 }
      );
    }

    await connectDB();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: 'Invalid order ID' }, { status: 400 });
    }

    const order = await Order.findById(id);
    if (!order) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }

    // Check if order can be deleted (only pending or cancelled orders)
    if (!['pending', 'cancelled'].includes(order.status)) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Cannot delete orders that are processing, shipped, or delivered. Cancel the order first.' 
        },
        { status: 400 }
      );
    }

    await Order.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: 'Order deleted successfully'
    });

  } catch (error) {
    console.error('Delete order error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete order' },
      { status: 500 }
    );
  }
}

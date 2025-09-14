import { NextResponse } from 'next/server';
import { authenticate } from '../../../../../lib/auth.js';
import Customer from '../../../../../models/Customer.js';
import connectDB from '../../../../../lib/database.js';

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

    const customer = await Customer.findById(id)
      .select('-password -refreshTokens -emailVerificationToken -passwordResetToken')
      .populate('createdBy', 'firstName lastName email')
      .populate('updatedBy', 'firstName lastName email')
      .lean();

    if (!customer) {
      return NextResponse.json(
        { success: false, message: 'Customer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { customer }
    });

  } catch (error) {
    console.error('Get customer error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch customer' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
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
    const body = await request.json();

    // Find the customer
    const existingCustomer = await Customer.findById(id);
    if (!existingCustomer) {
      return NextResponse.json(
        { success: false, message: 'Customer not found' },
        { status: 404 }
      );
    }

    // Check if email is being changed and if it already exists
    if (body.email && body.email !== existingCustomer.email) {
      const emailExists = await Customer.findOne({ 
        email: body.email.toLowerCase(),
        _id: { $ne: id }
      });
      if (emailExists) {
        return NextResponse.json(
          { success: false, message: 'Customer with this email already exists' },
          { status: 409 }
        );
      }
    }

    // Validate customer type permissions
    if (body.customerType && 
        (body.customerType === 'retail_customer' || body.customerType === 'wholesale_customer') && 
        !['admin', 'manager', 'sales'].includes(user.role)) {
      return NextResponse.json(
        { success: false, message: 'Only admin, manager, or sales can set retail/wholesale customer types' },
        { status: 403 }
      );
    }

    // Prepare update data
    const updateData = {
      ...body,
      email: body.email ? body.email.toLowerCase() : existingCustomer.email,
      updatedBy: user._id // Track who updated this customer
    };

    // Generate QR code if customer type changed to retail or wholesale and doesn't have one
    if (body.customerType && 
        (body.customerType === 'retail_customer' || body.customerType === 'wholesale_customer') &&
        (!existingCustomer.businessInfo?.qrCode || existingCustomer.customerType === 'final_customer')) {
      
      // Generate QR code
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2, 8).toUpperCase();
      const type = body.customerType === 'retail_customer' ? 'RT' : 'WS';
      const qrCode = `${type}_${timestamp}_${random}`;
      
      // Ensure businessInfo exists and add QR code
      if (!updateData.businessInfo) {
        updateData.businessInfo = existingCustomer.businessInfo || {};
      }
      updateData.businessInfo.qrCode = qrCode;
    }

    // Update the customer
    const updatedCustomer = await Customer.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
    .select('-password -refreshTokens -emailVerificationToken -passwordResetToken')
    .lean();

    return NextResponse.json({
      success: true,
      message: 'Customer updated successfully',
      data: { customer: updatedCustomer }
    });

  } catch (error) {
    console.error('Update customer error:', error);
    
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Failed to update customer' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const user = await authenticate(request);
    
    // Check if user has admin privileges (only admins can delete customers)
    if (user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Access denied. Admin privileges required.' },
        { status: 403 }
      );
    }

    await connectDB();
    const { id } = await params;

    const customer = await Customer.findById(id);
    if (!customer) {
      return NextResponse.json(
        { success: false, message: 'Customer not found' },
        { status: 404 }
      );
    }

    // Check if customer has any orders (you might want to prevent deletion if they do)
    // This is a placeholder - you'll need to implement order checking based on your Order model
    
    // Soft delete by setting isActive to false
    await Customer.findByIdAndUpdate(id, { 
      isActive: false,
      email: `deleted_${Date.now()}_${customer.email}` // Prevent email conflicts
    });

    return NextResponse.json({
      success: true,
      message: 'Customer deleted successfully'
    });

  } catch (error) {
    console.error('Delete customer error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete customer' },
      { status: 500 }
    );
  }
}

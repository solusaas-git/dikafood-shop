import { NextResponse } from 'next/server';
import { authenticate } from '../../../../../lib/auth.js';
import connectDB from '../../../../../lib/database.js';
import Customer from '../../../../../models/Customer.js';

export async function PUT(req, { params }) {
  try {
    await connectDB();
    
    // Authenticate user
    const user = await authenticate(req);
    
    const { addressId } = params;
    const addressData = await req.json();
    
    // Get customer
    const customer = await Customer.findById(user._id);
    
    if (!customer) {
      return NextResponse.json({
        success: false,
        message: 'Customer not found'
      }, { status: 404 });
    }

    // Find address
    const addressIndex = customer.addresses.findIndex(addr => addr._id.toString() === addressId);
    
    if (addressIndex === -1) {
      return NextResponse.json({
        success: false,
        message: 'Address not found'
      }, { status: 404 });
    }

    // Update address
    const updatedAddress = {
      ...customer.addresses[addressIndex].toObject(),
      ...addressData
    };

    // If this is set as default, unset other defaults
    if (updatedAddress.isDefault) {
      customer.addresses.forEach((addr, index) => {
        if (index !== addressIndex) {
          addr.isDefault = false;
        }
      });
    }

    customer.addresses[addressIndex] = updatedAddress;
    await customer.save();

    return NextResponse.json({
      success: true,
      message: 'Address updated successfully',
      data: customer.addresses[addressIndex]
    });

  } catch (error) {
    console.error('Update address error:', error);
    
    const status = error.message === 'Authentication failed' ? 401 : 500;
    
    return NextResponse.json({
      success: false,
      message: error.message || 'Failed to update address'
    }, { status });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    
    // Authenticate user
    const user = await authenticate(req);
    
    const { addressId } = params;
    
    // Get customer
    const customer = await Customer.findById(user._id);
    
    if (!customer) {
      return NextResponse.json({
        success: false,
        message: 'Customer not found'
      }, { status: 404 });
    }

    // Find address
    const addressIndex = customer.addresses.findIndex(addr => addr._id.toString() === addressId);
    
    if (addressIndex === -1) {
      return NextResponse.json({
        success: false,
        message: 'Address not found'
      }, { status: 404 });
    }

    // Remove address
    customer.addresses.splice(addressIndex, 1);
    await customer.save();

    return NextResponse.json({
      success: true,
      message: 'Address deleted successfully'
    });

  } catch (error) {
    console.error('Delete address error:', error);
    
    const status = error.message === 'Authentication failed' ? 401 : 500;
    
    return NextResponse.json({
      success: false,
      message: error.message || 'Failed to delete address'
    }, { status });
  }
}

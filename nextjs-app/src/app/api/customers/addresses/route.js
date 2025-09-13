import { NextResponse } from 'next/server';
import { authenticate } from '../../../../lib/auth.js';
import connectDB from '../../../../lib/database.js';
import Customer from '../../../../models/Customer.js';

export async function GET(req) {
  try {
    await connectDB();
    
    // Authenticate user
    const user = await authenticate(req);
    
    // Get customer with addresses
    const customer = await Customer.findById(user._id).select('addresses');
    
    if (!customer) {
      return NextResponse.json({
        success: false,
        message: 'Customer not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Addresses retrieved successfully',
      data: customer.addresses || []
    });

  } catch (error) {
    console.error('Get addresses error:', error);
    
    const status = error.message === 'Authentication failed' ? 401 : 500;
    
    return NextResponse.json({
      success: false,
      message: error.message || 'Failed to retrieve addresses'
    }, { status });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    
    // Authenticate user
    const user = await authenticate(req);
    
    const addressData = await req.json();
    
    // Validate required fields
    const requiredFields = ['type', 'street', 'city', 'postalCode', 'country'];
    const missingFields = requiredFields.filter(field => !addressData[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      }, { status: 400 });
    }

    // Get customer
    const customer = await Customer.findById(user._id);
    
    if (!customer) {
      return NextResponse.json({
        success: false,
        message: 'Customer not found'
      }, { status: 404 });
    }

    // Add new address
    const newAddress = {
      type: addressData.type,
      company: addressData.company || '',
      street: addressData.street,
      street2: addressData.street2 || '',
      city: addressData.city,
      state: addressData.state || '',
      postalCode: addressData.postalCode,
      country: addressData.country,
      phone: addressData.phone || '',
      instructions: addressData.instructions || '',
      isDefault: addressData.isDefault || false
    };

    // If this is set as default, unset other defaults
    if (newAddress.isDefault) {
      customer.addresses.forEach(addr => addr.isDefault = false);
    }

    customer.addresses.push(newAddress);
    await customer.save();

    return NextResponse.json({
      success: true,
      message: 'Address added successfully',
      data: customer.addresses[customer.addresses.length - 1]
    });

  } catch (error) {
    console.error('Add address error:', error);
    
    const status = error.message === 'Authentication failed' ? 401 : 500;
    
    return NextResponse.json({
      success: false,
      message: error.message || 'Failed to add address'
    }, { status });
  }
}

import { NextResponse } from 'next/server';
import { authenticate } from '../../../../lib/auth.js';
import Customer from '../../../../models/Customer.js';
import connectDB from '../../../../lib/database.js';

export async function GET(request) {
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

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const isActive = searchParams.get('isActive');
    const customerType = searchParams.get('customerType');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Build query for customers
    const query = {};

    // Add search conditions
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    if (isActive !== null && isActive !== undefined && isActive !== '') {
      query.isActive = isActive === 'true';
    }

    if (customerType && customerType !== 'all') {
      query.customerType = customerType;
    }

    // Build sort object
    const sort = {};
    if (sortBy === 'totalOrders') {
      sort.totalOrders = sortOrder === 'desc' ? -1 : 1;
    } else if (sortBy === 'totalSpent') {
      sort.totalSpent = sortOrder === 'desc' ? -1 : 1;
    } else if (sortBy === 'lastOrderDate') {
      sort.lastOrderDate = sortOrder === 'desc' ? -1 : 1;
    } else {
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    }

    // Get total count
    const total = await Customer.countDocuments(query);

    // Get customers with pagination
    const customers = await Customer.find(query)
      .select('-password -refreshTokens -emailVerificationToken -passwordResetToken')
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
    const stats = await Customer.aggregate([
      { $match: {} },
      {
        $group: {
          _id: null,
          totalCustomers: { $sum: 1 },
          activeCustomers: {
            $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
          },
          totalRevenue: { $sum: '$totalSpent' },
          totalOrders: { $sum: '$totalOrders' },
          averageOrderValue: { $avg: '$averageOrderValue' }
        }
      }
    ]);

    return NextResponse.json({
      success: true,
      data: {
        customers,
        pagination: {
          currentPage: page,
          totalPages,
          totalCustomers: total,
          hasNextPage,
          hasPrevPage,
          limit
        },
        stats: stats[0] || {
          totalCustomers: 0,
          activeCustomers: 0,
          totalRevenue: 0,
          totalOrders: 0,
          averageOrderValue: 0
        }
      }
    });

  } catch (error) {
    console.error('Get customers error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch customers' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
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

    const body = await request.json();
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      customerType = 'final_customer',
      dateOfBirth,
      gender,
      addresses,
      // Business info for retail/wholesale customers
      companyName,
      taxId,
      businessType,
      discountTier,
      creditLimit,
      paymentTerms
    } = body;

    // Validation
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'First name, last name, email, and password are required' },
        { status: 400 }
      );
    }

    // Validate customer type permissions
    if ((customerType === 'retail_customer' || customerType === 'wholesale_customer') && 
        !['admin', 'manager', 'sales'].includes(user.role)) {
      return NextResponse.json(
        { success: false, message: 'Only admin, manager, or sales can create retail/wholesale customers' },
        { status: 403 }
      );
    }

    // Check if customer already exists
    const existingCustomer = await Customer.findOne({ email: email.toLowerCase() });
    if (existingCustomer) {
      return NextResponse.json(
        { success: false, message: 'Customer with this email already exists' },
        { status: 409 }
      );
    }

    // Prepare business info for retail/wholesale customers
    const businessInfo = {};
    if (customerType === 'retail_customer' || customerType === 'wholesale_customer') {
      businessInfo.companyName = companyName || '';
      businessInfo.taxId = taxId || '';
      businessInfo.businessType = businessType || '';
      businessInfo.discountTier = discountTier || 0;
      businessInfo.creditLimit = creditLimit || 0;
      businessInfo.paymentTerms = paymentTerms || 0;
      // Generate QR code for business customers
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2, 8).toUpperCase();
      const type = customerType === 'retail_customer' ? 'RT' : 'WS';
      businessInfo.qrCode = `${type}_${timestamp}_${random}`;
    }

    // Create customer
    const newCustomer = new Customer({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password,
      phone,
      customerType,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
      gender,
      isEmailVerified: false,
      addresses: addresses || [],
      totalOrders: 0,
      totalSpent: 0,
      loyaltyPoints: 0,
      preferredCategories: [],
      averageOrderValue: 0,
      businessInfo: (customerType === 'retail_customer' || customerType === 'wholesale_customer') ? businessInfo : undefined,
      createdBy: user._id, // Track who created this customer
      updatedBy: user._id
    });

    await newCustomer.save();

    // Remove sensitive information before sending response
    const customerResponse = newCustomer.toJSON();
    delete customerResponse.password;

    return NextResponse.json({
      success: true,
      message: 'Customer created successfully',
      data: { customer: customerResponse }
    }, { status: 201 });

  } catch (error) {
    console.error('Create customer error:', error);
    
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Failed to create customer' },
      { status: 500 }
    );
  }
}

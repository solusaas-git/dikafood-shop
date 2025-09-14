import { NextResponse } from 'next/server';
import Order from '../../../models/Order.js';
import Customer from '../../../models/Customer.js';
import DeliveryMethod from '../../../models/DeliveryMethod.js';
import connectDB from '../../../lib/database.js';

// Helper function to map frontend payment method values to backend enum values
function mapPaymentMethod(frontendValue) {
  const paymentMethodMap = {
    'cash-on-delivery': 'cash_on_delivery',
    'bank-transfer': 'bank_transfer',
    'stripe': 'credit_card',
    'credit-card': 'credit_card',
    'store-credit': 'store_credit'
  };
  
  const normalized = frontendValue.toLowerCase().trim();
  return paymentMethodMap[normalized] || normalized.replace(/[-\s]/g, '_');
}

// POST /api/orders - Create new order (Customer-facing)
export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();

    // Extract order data from customer checkout
    const {
      items,
      customerInfo,
      billingAddress,
      deliveryAddress,
      paymentMethod,
      deliveryMethod,
      notes,
      total,
      subtotal,
      tax = 0,
      shipping = 0,
      discount = 0,
      currency = 'MAD'
    } = body;

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Order items are required' },
        { status: 400 }
      );
    }

    if (!customerInfo || !customerInfo.email) {
      return NextResponse.json(
        { success: false, message: 'Customer information is required' },
        { status: 400 }
      );
    }

    if (!deliveryAddress || !deliveryAddress.street || !deliveryAddress.city) {
      return NextResponse.json(
        { success: false, message: 'Delivery address is required' },
        { status: 400 }
      );
    }

    if (!paymentMethod || !total) {
      return NextResponse.json(
        { success: false, message: 'Payment method and total are required' },
        { status: 400 }
      );
    }

    // Find or create customer
    let customer = await Customer.findOne({ email: customerInfo.email.toLowerCase() });
    
    if (!customer) {
      // Create new customer from checkout info
      customer = new Customer({
        firstName: customerInfo.firstName,
        lastName: customerInfo.lastName,
        email: customerInfo.email.toLowerCase(),
        phone: customerInfo.phone,
        customerType: 'final_customer', // Default for customers from landing page
        password: 'temp_password_' + Date.now(), // Temporary password, customer can reset later
        isEmailVerified: false,
        addresses: [{
          type: 'both', // Use for both shipping and billing initially
          street: deliveryAddress.street,
          city: deliveryAddress.city,
          state: deliveryAddress.state || '',
          postalCode: deliveryAddress.postalCode || '',
          country: deliveryAddress.country || 'Morocco',
          isDefault: true
        }]
      });
      
      await customer.save();
    }

    // Transform items to match Order model structure
    const orderItems = items.map((item, index) => {
      // Handle pricing: price should be regular price, promotionalPrice should be discounted price
      const regularPrice = item.regularPrice || item.price;
      const promoPrice = item.promotionalPrice;
      const currentPrice = promoPrice || regularPrice; // Use promotional price if available
      
      // Debug logging for item data
      if (process.env.NODE_ENV === 'development') {
        console.log(`🛒 Order item ${index + 1} data:`, {
          name: item.productName || item.name,
          regularPrice,
          promoPrice,
          currentPrice,
          quantity: item.quantity,
          variant: item.variant,
          imageUrl: item.variant?.imageUrl || item.imageUrl,
          imageUrls: item.variant?.imageUrls || item.imageUrls
        });
      }
      
      return {
        product: item.product || item.productId,
        productName: item.productName || item.name,
        variant: {
          size: item.variant?.size || item.size,
          unit: item.variant?.unit || item.unit,
          sku: item.variant?.sku || item.sku,
          imageUrl: item.variant?.imageUrl || item.imageUrl,
          imageUrls: item.variant?.imageUrls || item.imageUrls || []
        },
        quantity: item.quantity,
        price: regularPrice, // Store regular price in price field
        promotionalPrice: promoPrice, // Store promotional price if available
        totalPrice: item.totalPrice || (currentPrice * item.quantity), // Calculate with current price
        discount: item.discount || 0
      };
    });

    // Create standardized addresses
    const shippingAddress = {
      firstName: customerInfo.firstName,
      lastName: customerInfo.lastName,
      company: deliveryAddress.company || '',
      street: deliveryAddress.street,
      street2: deliveryAddress.street2 || '',
      city: deliveryAddress.city,
      state: deliveryAddress.state || '',
      postalCode: deliveryAddress.postalCode || '',
      country: deliveryAddress.country || 'Morocco',
      phone: customerInfo.phone || '',
      instructions: deliveryAddress.instructions || notes || ''
    };

    const billingAddressData = billingAddress && Object.keys(billingAddress).length > 0 ? {
      firstName: billingAddress.firstName || customerInfo.firstName,
      lastName: billingAddress.lastName || customerInfo.lastName,
      company: billingAddress.company || '',
      street: billingAddress.street,
      street2: billingAddress.street2 || '',
      city: billingAddress.city,
      state: billingAddress.state || '',
      postalCode: billingAddress.postalCode || '',
      country: billingAddress.country || 'Morocco',
      phone: billingAddress.phone || customerInfo.phone || ''
    } : shippingAddress;

    // Calculate totals if not provided
    const calculatedSubtotal = subtotal || orderItems.reduce((sum, item) => sum + item.totalPrice, 0);
    const calculatedTotal = total || (calculatedSubtotal + tax + shipping - discount);

    // Generate order number manually as fallback
    const generateOrderNumber = async () => {
      const date = new Date();
      const dateStr = date.getFullYear().toString() + 
                     (date.getMonth() + 1).toString().padStart(2, '0') + 
                     date.getDate().toString().padStart(2, '0');
      
      // Find the highest order number for today
      const lastOrder = await Order.findOne({
        orderNumber: { $regex: `^ORD-${dateStr}-` }
      }).sort({ orderNumber: -1 });

      let sequence = 1;
      if (lastOrder) {
        const lastSequence = parseInt(lastOrder.orderNumber.split('-')[2]);
        sequence = lastSequence + 1;
      }

      return `ORD-${dateStr}-${sequence.toString().padStart(4, '0')}`;
    };

    const orderNumber = await generateOrderNumber();
    
    // Generate secure confirmation token
    const crypto = await import('crypto');
    const confirmationToken = crypto.randomBytes(32).toString('hex');

    console.log('🛒 Creating order with orderNumber:', orderNumber);
    console.log('🛒 Order data preview:', {
      orderNumber,
      confirmationToken: confirmationToken.substring(0, 8) + '...', // Only show first 8 chars for security
      customer: customer._id,
      itemsCount: orderItems.length,
      subtotal: calculatedSubtotal,
      total: calculatedTotal,
      paymentMethod: mapPaymentMethod(paymentMethod),
      deliveryMethod: deliveryMethod
    });

    // Create order
    const newOrder = new Order({
      orderNumber,
      confirmationToken,
      customer: customer._id,
      status: 'pending',
      items: orderItems,
      subtotal: calculatedSubtotal,
      tax,
      shipping,
      discount,
      total: calculatedTotal,
      shippingAddress,
      billingAddress: billingAddressData,
      paymentMethod: mapPaymentMethod(paymentMethod),
      deliveryMethod: deliveryMethod && deliveryMethod.trim() !== '' ? deliveryMethod : undefined,
      paymentStatus: 'pending',
      notes: notes || '',
      customerNotes: deliveryAddress.instructions || '',
      // Estimate delivery date (7 days from now by default)
      estimatedDeliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      history: [{
        status: 'pending',
        note: 'Order placed by customer',
        timestamp: new Date()
      }]
    });

    await newOrder.save();

    // Update customer statistics
    await Customer.findByIdAndUpdate(customer._id, {
      $inc: {
        totalOrders: 1,
        totalSpent: calculatedTotal
      },
      lastOrderDate: new Date(),
      averageOrderValue: (customer.totalSpent + calculatedTotal) / (customer.totalOrders + 1)
    });

    // Populate the customer data for response
    await newOrder.populate('customer', 'firstName lastName email customerType');

    // Return order details for confirmation
    return NextResponse.json({
      success: true,
      data: {
        order: newOrder,
        orderId: newOrder._id,
        orderNumber: newOrder.orderNumber,
        confirmationToken: newOrder.confirmationToken,
        confirmationUrl: `/confirmation/${newOrder.confirmationToken}`,
        customer: {
          id: customer._id,
          email: customer.email,
          firstName: customer.firstName,
          lastName: customer.lastName
        }
      },
      message: 'Order placed successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Create order error:', error);
    
    // Handle specific validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { success: false, message: 'Validation error', errors: validationErrors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Failed to create order' },
      { status: 500 }
    );
  }
}

// GET /api/orders - Get customer orders (if authenticated)
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const phone = searchParams.get('phone');
    const orderNumber = searchParams.get('orderNumber');

    // Simple order lookup for guests (no authentication required)
    if (orderNumber && (email || phone)) {
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

      const order = await Order.findOne({
        orderNumber: orderNumber,
        customer: customer._id
      }).populate('customer', 'firstName lastName email customerType');

      if (!order) {
        return NextResponse.json(
          { success: false, message: 'Order not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: order
      });
    }

    // If no specific lookup criteria, return error
    return NextResponse.json(
      { success: false, message: 'Order number and customer email/phone are required' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Get order error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

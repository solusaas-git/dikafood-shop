import { NextResponse } from 'next/server';
import { authenticate } from '../../../../lib/auth';
import PaymentMethod from '../../../../models/PaymentMethod';
import dbConnect from '../../../../lib/database';

export async function GET(req) {
  try {
    const user = await authenticate(req);
    
    // Check admin permissions
    if (!['admin', 'manager'].includes(user.role)) {
      return NextResponse.json({ 
        success: false, 
        message: 'Permissions insuffisantes' 
      }, { status: 403 });
    }

    await dbConnect();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search');
    const type = searchParams.get('type');
    const isActive = searchParams.get('isActive');
    const includeInactive = searchParams.get('includeInactive') === 'true';

    // Build query
    const query = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { provider: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (type) {
      query.type = type;
    }
    
    if (isActive !== null && isActive !== undefined && isActive !== '') {
      query.isActive = isActive === 'true';
    } else if (!includeInactive) {
      query.isActive = true;
    }

    // Get total count
    const total = await PaymentMethod.countDocuments(query);
    
    // Get payment methods with pagination
    const paymentMethods = await PaymentMethod.find(query)
      .populate('createdBy', 'firstName lastName')
      .populate('updatedBy', 'firstName lastName')
      .sort({ sortOrder: 1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // Hide sensitive configuration data in list view
    const sanitizedMethods = paymentMethods.map(method => {
      const { configuration, ...rest } = method;
      return {
        ...rest,
        hasConfiguration: !!configuration && Object.keys(configuration).length > 0
      };
    });

    const pagination = {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    };

    return NextResponse.json({
      success: true,
      data: {
        paymentMethods: sanitizedMethods,
        pagination
      }
    });

  } catch (error) {
    console.error('Get payment methods error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Erreur serveur' 
    }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const user = await authenticate(req);
    
    // Check admin permissions
    if (!['admin', 'manager'].includes(user.role)) {
      return NextResponse.json({ 
        success: false, 
        message: 'Permissions insuffisantes' 
      }, { status: 403 });
    }

    await dbConnect();

    const data = await req.json();
    
    // Validate required fields
    const { name, key, type } = data;
    if (!name || !key || !type) {
      return NextResponse.json({ 
        success: false, 
        message: 'Données manquantes' 
      }, { status: 400 });
    }

    // Check if key already exists
    const existingMethod = await PaymentMethod.findOne({ key: key.toLowerCase() });
    if (existingMethod) {
      return NextResponse.json({ 
        success: false, 
        message: 'Cette clé de méthode de paiement existe déjà' 
      }, { status: 400 });
    }

    // Create payment method
    const paymentMethod = new PaymentMethod({
      ...data,
      key: key.toLowerCase(),
      createdBy: user.id
    });

    await paymentMethod.save();

    // Populate references for response
    await paymentMethod.populate('createdBy', 'firstName lastName');

    return NextResponse.json({
      success: true,
      message: 'Méthode de paiement créée avec succès',
      data: { paymentMethod }
    });

  } catch (error) {
    console.error('Create payment method error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json({ 
        success: false, 
        message: errors.join(', ') 
      }, { status: 400 });
    }
    
    if (error.code === 11000) {
      return NextResponse.json({ 
        success: false, 
        message: 'Cette clé de méthode de paiement existe déjà' 
      }, { status: 400 });
    }
    
    return NextResponse.json({ 
      success: false, 
      message: 'Erreur serveur' 
    }, { status: 500 });
  }
}

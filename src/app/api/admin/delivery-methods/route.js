import { NextResponse } from 'next/server';
import { authenticate } from '../../../../lib/auth';
import DeliveryMethod from '../../../../models/DeliveryMethod';
import City from '../../../../models/City';
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
        { description: { $regex: search, $options: 'i' } }
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
    const total = await DeliveryMethod.countDocuments(query);
    
    // Get delivery methods with pagination
    const deliveryMethods = await DeliveryMethod.find(query)
      .populate('availableCities', 'name nameArabic')
      .populate('createdBy', 'firstName lastName')
      .populate('updatedBy', 'firstName lastName')
      .sort({ sortOrder: 1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const pagination = {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    };

    return NextResponse.json({
      success: true,
      data: {
        deliveryMethods,
        pagination
      }
    });

  } catch (error) {
    console.error('Get delivery methods error:', error);
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
    console.log('Received data for delivery method:', JSON.stringify(data, null, 2));
    
    // Validate required fields
    const { name, type, price, estimatedTime } = data;
    if (!name || !type || price === undefined || !estimatedTime) {
      return NextResponse.json({ 
        success: false, 
        message: 'Données manquantes' 
      }, { status: 400 });
    }

    // Validate cities if provided
    if (data.availableCities && data.availableCities.length > 0) {
      const validCities = await City.find({ 
        _id: { $in: data.availableCities },
        isActive: true 
      });
      
      if (validCities.length !== data.availableCities.length) {
        return NextResponse.json({ 
          success: false, 
          message: 'Une ou plusieurs villes sélectionnées sont invalides' 
        }, { status: 400 });
      }
    }

    // Create delivery method
    const deliveryMethodData = {
      ...data,
      createdBy: user.id
    };
    console.log('Creating delivery method with data:', JSON.stringify(deliveryMethodData, null, 2));
    
    const deliveryMethod = new DeliveryMethod(deliveryMethodData);
    console.log('DeliveryMethod before save - logo:', deliveryMethod.logo);

    await deliveryMethod.save();
    console.log('DeliveryMethod after save - logo:', deliveryMethod.logo);

    // Populate references for response
    await deliveryMethod.populate('availableCities', 'name nameArabic');
    await deliveryMethod.populate('createdBy', 'firstName lastName');

    return NextResponse.json({
      success: true,
      message: 'Méthode de livraison créée avec succès',
      data: { deliveryMethod }
    });

  } catch (error) {
    console.error('Create delivery method error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json({ 
        success: false, 
        message: errors.join(', ') 
      }, { status: 400 });
    }
    
    return NextResponse.json({ 
      success: false, 
      message: 'Erreur serveur' 
    }, { status: 500 });
  }
}

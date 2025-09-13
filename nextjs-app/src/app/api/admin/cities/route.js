import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/database';
import City from '../../../../models/City';
import { authenticate } from '../../../../lib/auth';

export async function GET(req) {
  try {
    const user = await authenticate(req);
    
    // Check admin permissions
    if (!['admin', 'manager'].includes(user.role)) {
      return NextResponse.json(
        { success: false, message: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    await dbConnect();
    
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const region = searchParams.get('region') || '';
    const isActive = searchParams.get('isActive');
    const deliveryAvailable = searchParams.get('deliveryAvailable');
    const sort = searchParams.get('sort') || 'asc';
    const sortBy = searchParams.get('sortBy') || 'name';
    const sortOrder = sort === 'desc' ? -1 : 1;

    // Build query
    const query = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { nameArabic: { $regex: search, $options: 'i' } },
        { region: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (region) {
      query.region = { $regex: region, $options: 'i' };
    }
    
    if (isActive !== null && isActive !== undefined && isActive !== '') {
      query.isActive = isActive === 'true';
    }
    
    if (deliveryAvailable !== null && deliveryAvailable !== undefined && deliveryAvailable !== '') {
      query.deliveryAvailable = deliveryAvailable === 'true';
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute query
    const [cities, totalCount] = await Promise.all([
      City.find(query)
        .populate('createdBy', 'firstName lastName')
        .populate('updatedBy', 'firstName lastName')
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit)
        .lean(),
      City.countDocuments(query)
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      success: true,
      data: {
        cities,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Get cities error:', error);
    return NextResponse.json({
      success: false,
      message: 'Erreur lors de la récupération des villes'
    }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const user = await authenticate(req);
    
    // Check admin permissions
    if (!['admin', 'manager'].includes(user.role)) {
      return NextResponse.json(
        { success: false, message: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    await dbConnect();

    const body = await req.json();
    const { name, nameArabic, region, postalCode, deliveryAvailable, deliveryFee, isActive, sortOrder } = body;

    // Validation
    if (!name || !region) {
      return NextResponse.json({
        success: false,
        message: 'Le nom de la ville et la région sont requis'
      }, { status: 400 });
    }

    // Check if city already exists
    const existingCity = await City.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') } 
    });
    
    if (existingCity) {
      return NextResponse.json({
        success: false,
        message: 'Une ville avec ce nom existe déjà'
      }, { status: 400 });
    }

    // Create city
    const cityData = {
      name: name.trim(),
      region: region.trim(),
      createdBy: user._id
    };

    if (nameArabic) cityData.nameArabic = nameArabic.trim();
    if (postalCode) cityData.postalCode = postalCode.trim();
    if (deliveryAvailable !== undefined) cityData.deliveryAvailable = deliveryAvailable;
    if (deliveryFee !== undefined) cityData.deliveryFee = parseFloat(deliveryFee);
    if (isActive !== undefined) cityData.isActive = isActive;
    if (sortOrder !== undefined) cityData.sortOrder = parseInt(sortOrder);

    const city = new City(cityData);
    await city.save();

    // Populate the created city
    await city.populate('createdBy', 'firstName lastName');

    return NextResponse.json({
      success: true,
      message: 'Ville créée avec succès',
      data: city
    }, { status: 201 });

  } catch (error) {
    console.error('Create city error:', error);
    
    if (error.code === 11000) {
      return NextResponse.json({
        success: false,
        message: 'Une ville avec ce nom existe déjà'
      }, { status: 400 });
    }
    
    return NextResponse.json({
      success: false,
      message: error.message || 'Erreur lors de la création de la ville'
    }, { status: 500 });
  }
}

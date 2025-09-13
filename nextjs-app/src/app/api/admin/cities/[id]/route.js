import { NextResponse } from 'next/server';
import dbConnect from '../../../../../lib/database';
import City from '../../../../../models/City';
import { authenticate } from '../../../../../lib/auth';

export async function GET(req, { params }) {
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
    
    const { id } = await params;

    const city = await City.findById(id)
      .populate('createdBy', 'firstName lastName')
      .populate('updatedBy', 'firstName lastName')
      .lean();

    if (!city) {
      return NextResponse.json({
        success: false,
        message: 'Ville non trouvée'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: city
    });

  } catch (error) {
    console.error('Get city error:', error);
    return NextResponse.json({
      success: false,
      message: 'Erreur lors de la récupération de la ville'
    }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
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
    
    const { id } = await params;
    const body = await req.json();
    const { name, nameArabic, region, postalCode, deliveryAvailable, deliveryFee, isActive, sortOrder } = body;

    // Validation
    if (!name || !region) {
      return NextResponse.json({
        success: false,
        message: 'Le nom de la ville et la région sont requis'
      }, { status: 400 });
    }

    // Check if city exists
    const existingCity = await City.findById(id);
    if (!existingCity) {
      return NextResponse.json({
        success: false,
        message: 'Ville non trouvée'
      }, { status: 404 });
    }

    // Check if another city with the same name exists (excluding current)
    const duplicateCity = await City.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') },
      _id: { $ne: id }
    });
    
    if (duplicateCity) {
      return NextResponse.json({
        success: false,
        message: 'Une ville avec ce nom existe déjà'
      }, { status: 400 });
    }

    // Update city
    const updateData = {
      name: name.trim(),
      region: region.trim(),
      updatedBy: user._id
    };

    if (nameArabic !== undefined) updateData.nameArabic = nameArabic ? nameArabic.trim() : '';
    if (postalCode !== undefined) updateData.postalCode = postalCode ? postalCode.trim() : '';
    if (deliveryAvailable !== undefined) updateData.deliveryAvailable = deliveryAvailable;
    if (deliveryFee !== undefined) updateData.deliveryFee = parseFloat(deliveryFee);
    if (isActive !== undefined) updateData.isActive = isActive;
    if (sortOrder !== undefined) updateData.sortOrder = parseInt(sortOrder);

    const city = await City.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('createdBy', 'firstName lastName')
     .populate('updatedBy', 'firstName lastName');

    return NextResponse.json({
      success: true,
      message: 'Ville mise à jour avec succès',
      data: city
    });

  } catch (error) {
    console.error('Update city error:', error);
    
    if (error.code === 11000) {
      return NextResponse.json({
        success: false,
        message: 'Une ville avec ce nom existe déjà'
      }, { status: 400 });
    }
    
    return NextResponse.json({
      success: false,
      message: error.message || 'Erreur lors de la mise à jour de la ville'
    }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
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
    
    const { id } = await params;

    const city = await City.findById(id);
    if (!city) {
      return NextResponse.json({
        success: false,
        message: 'Ville non trouvée'
      }, { status: 404 });
    }

    // Check if city is being used in orders or addresses
    // You might want to add these checks based on your needs
    
    await City.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: 'Ville supprimée avec succès'
    });

  } catch (error) {
    console.error('Delete city error:', error);
    return NextResponse.json({
      success: false,
      message: 'Erreur lors de la suppression de la ville'
    }, { status: 500 });
  }
}

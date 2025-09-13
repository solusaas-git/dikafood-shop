import { NextResponse } from 'next/server';
import { authenticate } from '../../../../../lib/auth';
import DeliveryMethod from '../../../../../models/DeliveryMethod';
import City from '../../../../../models/City';
import dbConnect from '../../../../../lib/database';

export async function GET(req, { params }) {
  try {
    const user = await authenticate(req);
    
    await dbConnect();

    const { id } = await params;
    
    const deliveryMethod = await DeliveryMethod.findById(id)
      .populate('availableCities', 'name nameArabic')
      .populate('createdBy', 'firstName lastName')
      .populate('updatedBy', 'firstName lastName');

    if (!deliveryMethod) {
      return NextResponse.json({ 
        success: false, 
        message: 'Méthode de livraison introuvable' 
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: { deliveryMethod }
    });

  } catch (error) {
    console.error('Get delivery method error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Erreur serveur' 
    }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
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

    const { id } = await params;
    const data = await req.json();
    console.log('Updating delivery method with data:', JSON.stringify(data, null, 2));

    // Find existing delivery method
    const deliveryMethod = await DeliveryMethod.findById(id);
    if (!deliveryMethod) {
      return NextResponse.json({ 
        success: false, 
        message: 'Méthode de livraison introuvable' 
      }, { status: 404 });
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

    // Update delivery method
    console.log('Before update - deliveryMethod.logo:', deliveryMethod.logo);
    Object.assign(deliveryMethod, data);
    deliveryMethod.updatedBy = user.id;
    console.log('After update - deliveryMethod.logo:', deliveryMethod.logo);
    
    await deliveryMethod.save();
    console.log('After save - deliveryMethod.logo:', deliveryMethod.logo);

    // Populate references for response
    await deliveryMethod.populate('availableCities', 'name nameArabic');
    await deliveryMethod.populate('updatedBy', 'firstName lastName');

    return NextResponse.json({
      success: true,
      message: 'Méthode de livraison mise à jour avec succès',
      data: { deliveryMethod }
    });

  } catch (error) {
    console.error('Update delivery method error:', error);
    
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

export async function DELETE(req, { params }) {
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

    const { id } = await params;

    const deliveryMethod = await DeliveryMethod.findById(id);
    if (!deliveryMethod) {
      return NextResponse.json({ 
        success: false, 
        message: 'Méthode de livraison introuvable' 
      }, { status: 404 });
    }

    // TODO: Check if delivery method is being used in orders before deletion
    
    await DeliveryMethod.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: 'Méthode de livraison supprimée avec succès'
    });

  } catch (error) {
    console.error('Delete delivery method error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Erreur serveur' 
    }, { status: 500 });
  }
}

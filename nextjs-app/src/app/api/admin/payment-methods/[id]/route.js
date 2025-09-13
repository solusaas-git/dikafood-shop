import { NextResponse } from 'next/server';
import { authenticate } from '../../../../../lib/auth';
import PaymentMethod from '../../../../../models/PaymentMethod';
import dbConnect from '../../../../../lib/database';

export async function GET(req, { params }) {
  try {
    const user = await authenticate(req);
    
    await dbConnect();

    const { id } = await params;
    
    const paymentMethod = await PaymentMethod.findById(id)
      .populate('createdBy', 'firstName lastName')
      .populate('updatedBy', 'firstName lastName');

    if (!paymentMethod) {
      return NextResponse.json({ 
        success: false, 
        message: 'Méthode de paiement introuvable' 
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: { paymentMethod }
    });

  } catch (error) {
    console.error('Get payment method error:', error);
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

    // Find existing payment method
    const paymentMethod = await PaymentMethod.findById(id);
    if (!paymentMethod) {
      return NextResponse.json({ 
        success: false, 
        message: 'Méthode de paiement introuvable' 
      }, { status: 404 });
    }

    // Check if key is being changed and if new key already exists
    if (data.key && data.key.toLowerCase() !== paymentMethod.key) {
      const existingMethod = await PaymentMethod.findOne({ 
        key: data.key.toLowerCase(),
        _id: { $ne: id }
      });
      
      if (existingMethod) {
        return NextResponse.json({ 
          success: false, 
          message: 'Cette clé de méthode de paiement existe déjà' 
        }, { status: 400 });
      }
      
      data.key = data.key.toLowerCase();
    }

    // Update payment method
    Object.assign(paymentMethod, data);
    paymentMethod.updatedBy = user.id;
    
    await paymentMethod.save();

    // Populate references for response
    await paymentMethod.populate('updatedBy', 'firstName lastName');

    return NextResponse.json({
      success: true,
      message: 'Méthode de paiement mise à jour avec succès',
      data: { paymentMethod }
    });

  } catch (error) {
    console.error('Update payment method error:', error);
    
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

    const paymentMethod = await PaymentMethod.findById(id);
    if (!paymentMethod) {
      return NextResponse.json({ 
        success: false, 
        message: 'Méthode de paiement introuvable' 
      }, { status: 404 });
    }

    // TODO: Check if payment method is being used in orders before deletion
    
    await PaymentMethod.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: 'Méthode de paiement supprimée avec succès'
    });

  } catch (error) {
    console.error('Delete payment method error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Erreur serveur' 
    }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/database';
import Customer from '../../../../models/Customer';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    // Parse request body
    const { token, password } = await request.json();

    // Validate input
    if (!token || !password) {
      return NextResponse.json(
        { success: false, message: 'Token et mot de passe requis' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { success: false, message: 'Le mot de passe doit contenir au moins 8 caractères' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    try {
      // Verify the reset token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      if (decoded.type !== 'password-reset') {
        return NextResponse.json(
          { success: false, message: 'Token invalide' },
          { status: 400 }
        );
      }

      // Find the customer
      const customer = await Customer.findById(decoded.customerId);
      
      if (!customer) {
        return NextResponse.json(
          { success: false, message: 'Utilisateur non trouvé' },
          { status: 404 }
        );
      }

      // Verify email matches (additional security)
      if (customer.email.toLowerCase() !== decoded.email.toLowerCase()) {
        return NextResponse.json(
          { success: false, message: 'Token invalide' },
          { status: 400 }
        );
      }

      // Hash the new password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Update customer password
      customer.password = hashedPassword;
      customer.updatedAt = new Date();
      await customer.save();

      console.log('Password reset successful for customer:', customer.email);

      return NextResponse.json({
        success: true,
        message: 'Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.'
      });

    } catch (tokenError) {
      console.error('Token verification failed:', tokenError);
      
      if (tokenError.name === 'TokenExpiredError') {
        return NextResponse.json(
          { success: false, message: 'Le lien de réinitialisation a expiré. Veuillez demander un nouveau lien.' },
          { status: 400 }
        );
      } else if (tokenError.name === 'JsonWebTokenError') {
        return NextResponse.json(
          { success: false, message: 'Lien de réinitialisation invalide.' },
          { status: 400 }
        );
      } else {
        throw tokenError;
      }
    }

  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

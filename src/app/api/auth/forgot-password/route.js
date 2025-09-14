import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/database';
import Customer from '../../../../models/Customer';
import EmailSettings from '../../../../models/EmailSettings';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    // Parse request body
    const { email } = await request.json();

    // Validate email
    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Find customer by email
    const customer = await Customer.findOne({ email: email.toLowerCase() });

    // Always return success for security (don't reveal if email exists)
    // But only send email if customer exists
    if (customer) {
      // Generate reset token (expires in 1 hour)
      const resetToken = jwt.sign(
        { 
          customerId: customer._id, 
          email: customer.email,
          type: 'password-reset'
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      // Create reset URL - will open the modal with reset form
      const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}?token=${resetToken}`;

      // Get email settings from database
      const emailSettings = await EmailSettings.findOne({ isActive: true });
      
      if (!emailSettings) {
        console.error('No email settings configured');
        // Still return success for security, but don't send email
        return NextResponse.json({
          success: true,
          message: 'Si cette adresse email existe dans notre système, vous recevrez un lien de réinitialisation.'
        });
      }

      // Configure email transporter based on database settings
      let transporter;
      
      if (emailSettings.emailService === 'gmail') {
        if (!emailSettings.gmailUser || !emailSettings.gmailAppPassword) {
          console.error('Gmail configuration incomplete');
          return NextResponse.json({
            success: true,
            message: 'Si cette adresse email existe dans notre système, vous recevrez un lien de réinitialisation.'
          });
        }
        
        transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: emailSettings.gmailUser,
            pass: emailSettings.gmailAppPassword,
          },
        });
      } else {
        // SMTP configuration
        if (!emailSettings.smtpHost || !emailSettings.smtpUser || !emailSettings.smtpPass) {
          console.error('SMTP configuration incomplete');
          return NextResponse.json({
            success: true,
            message: 'Si cette adresse email existe dans notre système, vous recevrez un lien de réinitialisation.'
          });
        }
        
        transporter = nodemailer.createTransport({
          host: emailSettings.smtpHost,
          port: emailSettings.smtpPort,
          secure: emailSettings.smtpSecure,
          auth: {
            user: emailSettings.smtpUser,
            pass: emailSettings.smtpPass,
          },
        });
      }

      // Email content in French
      const mailOptions = {
        from: `${emailSettings.fromName} <${emailSettings.fromEmail}>`,
        to: customer.email,
        subject: emailSettings.forgotPasswordSubject,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Réinitialisation de mot de passe</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #2D5016 0%, #8FBC8F 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">DikaFood</h1>
              <p style="color: #E8F5E8; margin: 10px 0 0 0; font-size: 16px;">Authenticité Marocaine</p>
            </div>
            
            <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-radius: 0 0 10px 10px;">
              <h2 style="color: #2D5016; margin-top: 0;">Réinitialisation de votre mot de passe</h2>
              
              <p>Bonjour <strong>${customer.firstName || 'Cher client'}</strong>,</p>
              
              <p>Nous avons reçu une demande de réinitialisation de mot de passe pour votre compte DikaFood.</p>
              
              <p>Pour réinitialiser votre mot de passe, cliquez sur le bouton ci-dessous :</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" 
                   style="background: #8FBC8F; color: #2D5016; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block; font-size: 16px;">
                  Réinitialiser mon mot de passe
                </a>
              </div>
              
              <p style="color: #666; font-size: 14px;">
                <strong>Ce lien expire dans 1 heure.</strong><br>
                Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email en toute sécurité.
              </p>
              
              <p style="color: #666; font-size: 14px;">
                Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :<br>
                <a href="${resetUrl}" style="color: #8FBC8F; word-break: break-all;">${resetUrl}</a>
              </p>
              
              <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
              
              <p style="color: #666; font-size: 12px; text-align: center;">
                Cet email a été envoyé par DikaFood<br>
                Si vous avez des questions, contactez-nous à support@dikafood.com
              </p>
            </div>
          </body>
          </html>
        `,
        text: `
          Réinitialisation de votre mot de passe - DikaFood
          
          Bonjour ${customer.firstName || 'Cher client'},
          
          Nous avons reçu une demande de réinitialisation de mot de passe pour votre compte DikaFood.
          
          Pour réinitialiser votre mot de passe, cliquez sur ce lien :
          ${resetUrl}
          
          Ce lien expire dans 1 heure.
          
          Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email en toute sécurité.
          
          DikaFood - Authenticité Marocaine
        `
      };

      try {
        // Send email
        await transporter.sendMail(mailOptions);
        console.log('Password reset email sent to:', customer.email);
      } catch (emailError) {
        console.error('Failed to send reset email:', emailError);
        // Don't return error to user for security reasons
      }
    }

    // Always return success (for security)
    return NextResponse.json({
      success: true,
      message: 'Si cette adresse email existe dans notre système, vous recevrez un lien de réinitialisation.'
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { success: false, message: 'Une erreur est survenue. Veuillez réessayer.' },
      { status: 500 }
    );
  }
}

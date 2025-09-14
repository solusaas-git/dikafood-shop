import { NextResponse } from 'next/server';
import connectDB from '../../../../../lib/database';
import EmailSettings from '../../../../../models/EmailSettings';
import { authenticate } from '../../../../../lib/auth';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    // Authenticate user
    const user = await authenticate(request);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is admin or manager
    if (user.role !== 'admin' && user.role !== 'manager') {
      return NextResponse.json(
        { success: false, message: 'Forbidden' },
        { status: 403 }
      );
    }

    const { testEmail } = await request.json();

    if (!testEmail) {
      return NextResponse.json(
        { success: false, message: 'Test email address is required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Get email settings
    const emailSettings = await EmailSettings.findOne({ isActive: true });
    
    if (!emailSettings) {
      return NextResponse.json(
        { success: false, message: 'No email settings configured' },
        { status: 400 }
      );
    }

    // Create transporter based on configuration
    let transporter;
    
    if (emailSettings.emailService === 'gmail') {
      if (!emailSettings.gmailUser || !emailSettings.gmailAppPassword) {
        return NextResponse.json(
          { success: false, message: 'Gmail configuration incomplete' },
          { status: 400 }
        );
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
        return NextResponse.json(
          { success: false, message: 'SMTP configuration incomplete' },
          { status: 400 }
        );
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

    // Test email content
    const mailOptions = {
      from: `${emailSettings.fromName} <${emailSettings.fromEmail}>`,
      to: testEmail,
      subject: 'Test Email - DikaFood Configuration',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Test Email</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #2D5016 0%, #8FBC8F 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">DikaFood</h1>
            <p style="color: #E8F5E8; margin: 10px 0 0 0; font-size: 16px;">Authenticité Marocaine</p>
          </div>
          
          <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-radius: 0 0 10px 10px;">
            <h2 style="color: #2D5016; margin-top: 0;">✅ Test Email Réussi !</h2>
            
            <p>Félicitations ! Votre configuration email fonctionne parfaitement.</p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #2D5016; margin-top: 0;">Configuration testée :</h3>
              <ul style="margin: 0; padding-left: 20px;">
                <li><strong>Service :</strong> ${emailSettings.emailService.toUpperCase()}</li>
                <li><strong>De :</strong> ${emailSettings.fromName} &lt;${emailSettings.fromEmail}&gt;</li>
                <li><strong>Vers :</strong> ${testEmail}</li>
                <li><strong>Date :</strong> ${new Date().toLocaleString('fr-FR')}</li>
              </ul>
            </div>
            
            <p>Vos emails système (réinitialisation de mot de passe, notifications, etc.) seront maintenant envoyés avec cette configuration.</p>
            
            <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
            
            <p style="color: #666; font-size: 12px; text-align: center;">
              Cet email de test a été envoyé depuis l'interface d'administration DikaFood
            </p>
          </div>
        </body>
        </html>
      `,
      text: `
        Test Email - DikaFood Configuration
        
        Félicitations ! Votre configuration email fonctionne parfaitement.
        
        Configuration testée :
        - Service : ${emailSettings.emailService.toUpperCase()}
        - De : ${emailSettings.fromName} <${emailSettings.fromEmail}>
        - Vers : ${testEmail}
        - Date : ${new Date().toLocaleString('fr-FR')}
        
        Vos emails système seront maintenant envoyés avec cette configuration.
      `
    };

    // Send test email
    await transporter.sendMail(mailOptions);

    // Update test status in database
    emailSettings.lastTested = new Date();
    emailSettings.testStatus = 'success';
    emailSettings.testError = '';
    await emailSettings.save();

    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully'
    });

  } catch (error) {
    console.error('Test email error:', error);
    
    // Update test status in database
    try {
      await connectDB();
      const emailSettings = await EmailSettings.findOne({ isActive: true });
      if (emailSettings) {
        emailSettings.lastTested = new Date();
        emailSettings.testStatus = 'failed';
        emailSettings.testError = error.message;
        await emailSettings.save();
      }
    } catch (dbError) {
      console.error('Failed to update test status:', dbError);
    }

    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to send test email',
        error: error.message 
      },
      { status: 500 }
    );
  }
}

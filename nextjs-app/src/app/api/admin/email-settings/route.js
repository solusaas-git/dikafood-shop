import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/database';
import EmailSettings from '../../../../models/EmailSettings';
import { authenticate } from '../../../../lib/auth';
import nodemailer from 'nodemailer';

export async function GET(request) {
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

    await connectDB();

    // Get email settings (there should only be one active configuration)
    let emailSettings = await EmailSettings.findOne({ isActive: true });
    
    if (!emailSettings) {
      // Create default settings if none exist
      emailSettings = new EmailSettings({
        emailService: 'smtp',
        smtpHost: 'smtp.mailtrap.io',
        smtpPort: 587,
        smtpSecure: false,
        fromEmail: 'noreply@dikafood.com',
        fromName: 'DikaFood',
        forgotPasswordSubject: 'Réinitialisation de votre mot de passe - DikaFood',
        isActive: true
      });
      await emailSettings.save();
    }

    // Don't send sensitive data like passwords
    const sanitizedSettings = {
      ...emailSettings.toObject(),
      smtpPass: emailSettings.smtpPass ? '••••••••' : '',
      gmailAppPassword: emailSettings.gmailAppPassword ? '••••••••' : ''
    };

    return NextResponse.json({
      success: true,
      data: sanitizedSettings
    });

  } catch (error) {
    console.error('Get email settings error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
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

    const body = await request.json();
    const {
      emailService,
      smtpHost,
      smtpPort,
      smtpSecure,
      smtpUser,
      smtpPass,
      gmailUser,
      gmailAppPassword,
      fromEmail,
      fromName,
      forgotPasswordSubject,
      testEmail
    } = body;

    await connectDB();

    // Get existing settings or create new one
    let emailSettings = await EmailSettings.findOne({ isActive: true });
    
    if (!emailSettings) {
      emailSettings = new EmailSettings({ isActive: true });
    }

    // Update fields
    emailSettings.emailService = emailService;
    emailSettings.fromEmail = fromEmail;
    emailSettings.fromName = fromName;
    emailSettings.forgotPasswordSubject = forgotPasswordSubject;
    emailSettings.testEmail = testEmail;

    // Update service-specific fields
    if (emailService === 'smtp') {
      emailSettings.smtpHost = smtpHost;
      emailSettings.smtpPort = smtpPort;
      emailSettings.smtpSecure = smtpSecure;
      emailSettings.smtpUser = smtpUser;
      if (smtpPass && smtpPass !== '••••••••') {
        emailSettings.smtpPass = smtpPass;
      }
    } else if (emailService === 'gmail') {
      emailSettings.gmailUser = gmailUser;
      if (gmailAppPassword && gmailAppPassword !== '••••••••') {
        emailSettings.gmailAppPassword = gmailAppPassword;
      }
    }

    await emailSettings.save();

    // Return sanitized data
    const sanitizedSettings = {
      ...emailSettings.toObject(),
      smtpPass: emailSettings.smtpPass ? '••••••••' : '',
      gmailAppPassword: emailSettings.gmailAppPassword ? '••••••••' : ''
    };

    return NextResponse.json({
      success: true,
      message: 'Email settings updated successfully',
      data: sanitizedSettings
    });

  } catch (error) {
    console.error('Update email settings error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

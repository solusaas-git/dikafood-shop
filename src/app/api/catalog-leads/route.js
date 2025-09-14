import { NextResponse } from 'next/server';
import connectDB from '../../../lib/database.js';
import CatalogLead from '../../../models/CatalogLead.js';
import EmailSettings from '../../../models/EmailSettings.js';
import nodemailer from 'nodemailer';
import path from 'path';
import fs from 'fs';

/**
 * Create email transporter using database settings
 */
async function createTransporter() {
  await connectDB();
  
  // Get email settings from database
  const emailSettings = await EmailSettings.findOne({ isActive: true });
  
  if (!emailSettings) {
    throw new Error('Email settings not configured in database');
  }

  let transporter;
  
  if (emailSettings.emailService === 'gmail') {
    if (!emailSettings.gmailUser || !emailSettings.gmailAppPassword) {
      throw new Error('Gmail configuration incomplete in database');
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
      throw new Error('SMTP configuration incomplete in database');
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
  
  return { transporter, emailSettings };
}

/**
 * Send catalog email to user
 */
async function sendCatalogEmail(leadData, requestedLanguages = ['fr']) {
  const { transporter, emailSettings } = await createTransporter();
  
  // Prepare attachments for requested languages
  const attachments = [];
  
  for (const language of requestedLanguages) {
    const catalogFileName = language === 'fr' ? 'catalogue-dikafood.pdf' : 'catalogue-dikafood-ar.pdf';
    const catalogPath = path.join(process.cwd(), 'public', 'catalogues', catalogFileName);
    
    // Check if file exists, fallback to French if Arabic doesn't exist
    let finalPath = catalogPath;
    let finalFilename = catalogFileName;
    
    if (!fs.existsSync(catalogPath) && language === 'ar') {
      finalPath = path.join(process.cwd(), 'public', 'catalogues', 'catalogue-dikafood.pdf');
      finalFilename = 'catalogue-dikafood.pdf';
    }
    
    if (fs.existsSync(finalPath)) {
      attachments.push({
        filename: finalFilename,
        path: finalPath,
        contentType: 'application/pdf'
      });
    }
  }
  
  // Email content based on primary language
  const primaryLang = requestedLanguages[0] || 'fr';
  const isArabic = primaryLang === 'ar';
  
  const emailContent = {
    fr: {
      subject: '🫒 Votre catalogue DIKAFOOD - Huiles d\'olive d\'exception',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 20px;">
          <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #2d5016; margin: 0; font-size: 28px;">🫒 DIKAFOOD</h1>
              <p style="color: #666; margin: 10px 0 0 0; font-size: 16px;">Huiles d'olive d'exception</p>
            </div>
            
            <h2 style="color: #2d5016; border-bottom: 2px solid #ebeb47; padding-bottom: 10px;">
              Bonjour ${leadData.name} ${leadData.surname},
            </h2>
            
            <p style="color: #333; line-height: 1.6; font-size: 16px;">
              Merci pour votre intérêt pour nos produits ! Vous trouverez en pièce jointe notre catalogue complet 
              présentant notre gamme d'huiles d'olive d'exception.
            </p>
            
            <div style="background: #f0f8e8; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ebeb47;">
              <h3 style="color: #2d5016; margin: 0 0 10px 0; font-size: 18px;">✨ Découvrez nos produits :</h3>
              <ul style="color: #333; margin: 0; padding-left: 20px; line-height: 1.8;">
                <li>Huiles d'olive extra vierges premium</li>
                <li>Différents formats disponibles (250ml, 500ml, 1L, 5L)</li>
                <li>Qualité contrôlée et certifiée</li>
                <li>Livraison dans tout le Maroc</li>
              </ul>
            </div>
            
            <p style="color: #333; line-height: 1.6; font-size: 16px;">
              Pour toute question ou pour passer commande, n'hésitez pas à nous contacter :
            </p>
            
            <div style="background: #2d5016; color: white; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
              <p style="margin: 0; font-size: 16px;">📞 <strong>Téléphone :</strong> +212 XXX XXX XXX</p>
              <p style="margin: 10px 0 0 0; font-size: 16px;">📧 <strong>Email :</strong> contact@dikafood.com</p>
            </div>
            
            <p style="color: #666; font-size: 14px; text-align: center; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
              Cordialement,<br>
              <strong>L'équipe DIKAFOOD</strong><br>
              <em>Votre spécialiste en huiles d'olive d'exception</em>
            </p>
          </div>
        </div>
      `
    },
    ar: {
      subject: '🫒 كتالوج DIKAFOOD - زيوت الزيتون الاستثنائية',
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 20px;">
          <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #2d5016; margin: 0; font-size: 28px;">🫒 DIKAFOOD</h1>
              <p style="color: #666; margin: 10px 0 0 0; font-size: 16px;">زيوت الزيتون الاستثنائية</p>
            </div>
            
            <h2 style="color: #2d5016; border-bottom: 2px solid #ebeb47; padding-bottom: 10px;">
              مرحباً ${leadData.name} ${leadData.surname}،
            </h2>
            
            <p style="color: #333; line-height: 1.6; font-size: 16px;">
              شكراً لاهتمامك بمنتجاتنا! ستجد في المرفق كتالوجنا الكامل الذي يعرض مجموعتنا من زيوت الزيتون الاستثنائية.
            </p>
            
            <div style="background: #f0f8e8; padding: 20px; border-radius: 8px; margin: 20px 0; border-right: 4px solid #ebeb47;">
              <h3 style="color: #2d5016; margin: 0 0 10px 0; font-size: 18px;">✨ اكتشف منتجاتنا:</h3>
              <ul style="color: #333; margin: 0; padding-right: 20px; line-height: 1.8;">
                <li>زيوت زيتون بكر ممتازة عالية الجودة</li>
                <li>أحجام مختلفة متوفرة (250مل، 500مل، 1ل، 5ل)</li>
                <li>جودة مراقبة ومعتمدة</li>
                <li>توصيل في جميع أنحاء المغرب</li>
              </ul>
            </div>
            
            <p style="color: #333; line-height: 1.6; font-size: 16px;">
              لأي استفسار أو لتقديم طلب، لا تتردد في الاتصال بنا:
            </p>
            
            <div style="background: #2d5016; color: white; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
              <p style="margin: 0; font-size: 16px;">📞 <strong>الهاتف:</strong> +212 XXX XXX XXX</p>
              <p style="margin: 10px 0 0 0; font-size: 16px;">📧 <strong>البريد الإلكتروني:</strong> contact@dikafood.com</p>
            </div>
            
            <p style="color: #666; font-size: 14px; text-align: center; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
              مع أطيب التحيات،<br>
              <strong>فريق DIKAFOOD</strong><br>
              <em>متخصصون في زيوت الزيتون الاستثنائية</em>
            </p>
          </div>
        </div>
      `
    }
  };
  
  const content = emailContent[primaryLang] || emailContent.fr;
  
  const mailOptions = {
    from: `"${emailSettings.fromName}" <${emailSettings.fromEmail}>`,
    to: leadData.email,
    subject: content.subject,
    html: content.html,
    attachments: attachments
  };
  
  // Send email
  const info = await transporter.sendMail(mailOptions);
  return info;
}

/**
 * POST /api/catalog-leads - Create new catalog lead and send email
 */
export async function POST(req) {
  try {
    await connectDB();
    
    const body = await req.json();
    const { name, surname, email, telephone, requestedLanguages = ['fr'] } = body;
    
    // Validate required fields
    if (!name || !surname || !email || !telephone) {
      return NextResponse.json({
        success: false,
        message: 'All fields are required'
      }, { status: 400 });
    }
    
    // Get client IP and user agent for tracking
    const clientIP = req.headers.get('x-forwarded-for') || 
                    req.headers.get('x-real-ip') || 
                    req.ip || 
                    'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';
    
    // Create catalog lead
    const catalogLead = new CatalogLead({
      name: name.trim(),
      surname: surname.trim(),
      email: email.trim().toLowerCase(),
      telephone: telephone.trim(),
      requestedLanguages,
      ipAddress: clientIP,
      userAgent,
      status: 'pending'
    });
    
    // Save to database (without sending email yet)
    const savedLead = await catalogLead.save();
    
    // Return success - email will be sent when user selects language
    return NextResponse.json({
      success: true,
      message: 'Catalog request saved successfully',
      data: {
        leadId: savedLead._id,
        emailSent: false,
        awaitingLanguageSelection: true
      }
    }, { status: 201 });
    
  } catch (error) {
    console.error('Catalog lead creation error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      }, { status: 400 });
    }
    
    return NextResponse.json({
      success: false,
      message: 'Failed to process catalog request'
    }, { status: 500 });
  }
}

/**
 * GET /api/catalog-leads - Get catalog leads (admin only)
 */
export async function GET(req) {
  try {
    await connectDB();
    
    // Add authentication check for admin users
    const { authenticate } = await import('../../../lib/auth.js');
    const user = await authenticate(req);
    
    if (!user) {
      return NextResponse.json({ 
        success: false, 
        message: 'Authentication required' 
      }, { status: 401 });
    }
    
    if (!['admin', 'manager', 'sales'].includes(user.role)) {
      return NextResponse.json({ 
        success: false, 
        message: 'Insufficient permissions to view catalog leads' 
      }, { status: 403 });
    }
    
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    
    const result = await CatalogLead.getLeadsWithPagination({
      page,
      limit,
      status,
      search,
      dateFrom,
      dateTo,
      sortBy,
      sortOrder
    });
    
    return NextResponse.json({
      success: true,
      data: result
    });
    
  } catch (error) {
    console.error('Get catalog leads error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch catalog leads'
    }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/database.js';
import CatalogLead from '../../../../models/CatalogLead.js';
import EmailSettings from '../../../../models/EmailSettings.js';
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
 * Send catalog email to user with selected language
 */
async function sendCatalogEmail(leadData, selectedLanguage) {
  const { transporter, emailSettings } = await createTransporter();
  
  // Prepare attachment for selected language
  const catalogFileName = selectedLanguage === 'fr' ? 'catalogue-dikafood.pdf' : 'catalogue-dikafood-ar.pdf';
  const catalogPath = path.join(process.cwd(), 'public', 'catalogues', catalogFileName);
  
  console.log(`📁 Looking for catalog: ${catalogFileName} at ${catalogPath}`);
  
  // Check if file exists, fallback to French if Arabic doesn't exist
  let finalPath = catalogPath;
  let finalFilename = catalogFileName;
  let usingFallback = false;
  
  if (!fs.existsSync(catalogPath) && selectedLanguage === 'ar') {
    console.log('⚠️ Arabic catalog not found, falling back to French version');
    finalPath = path.join(process.cwd(), 'public', 'catalogues', 'catalogue-dikafood.pdf');
    finalFilename = 'catalogue-dikafood.pdf';
    usingFallback = true;
  }
  
  const attachments = [];
  if (fs.existsSync(finalPath)) {
    attachments.push({
      filename: finalFilename,
      path: finalPath,
      contentType: 'application/pdf'
    });
    console.log(`✅ Attaching catalog: ${finalFilename} (${usingFallback ? 'fallback' : 'requested language'})`);
  } else {
    console.log('❌ No catalog file found to attach');
  }
  
  // Email content based on selected language
  const isArabic = selectedLanguage === 'ar';
  
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
              présentant notre gamme d'huiles d'olive d'exception${usingFallback ? ' (version française)' : ''}.
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
              شكراً لاهتمامك بمنتجاتنا! ستجد في المرفق كتالوجنا الكامل الذي يعرض مجموعتنا من زيوت الزيتون الاستثنائية${usingFallback ? ' (النسخة الفرنسية)' : ''}.
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
  
  const content = emailContent[selectedLanguage] || emailContent.fr;
  
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
 * POST /api/catalog-leads/send-email - Send catalog email with selected language
 */
export async function POST(req) {
  try {
    console.log('📧 Send email API called');
    await connectDB();
    
    const body = await req.json();
    const { leadId, selectedLanguage } = body;
    
    console.log('📧 Email request data:', { leadId, selectedLanguage });
    
    // Validate required fields
    if (!leadId || !selectedLanguage) {
      console.log('❌ Missing required fields:', { leadId, selectedLanguage });
      return NextResponse.json({
        success: false,
        message: 'Lead ID and selected language are required'
      }, { status: 400 });
    }
    
    // Validate language
    if (!['fr', 'ar'].includes(selectedLanguage)) {
      return NextResponse.json({
        success: false,
        message: 'Invalid language. Must be "fr" or "ar"'
      }, { status: 400 });
    }
    
    // Find the catalog lead
    const catalogLead = await CatalogLead.findById(leadId);
    
    if (!catalogLead) {
      return NextResponse.json({
        success: false,
        message: 'Catalog lead not found'
      }, { status: 404 });
    }
    
    // Check if email was already sent
    if (catalogLead.emailSentSuccessfully) {
      return NextResponse.json({
        success: true,
        message: 'Email was already sent for this request',
        data: {
          leadId: catalogLead._id,
          emailSent: true,
          alreadySent: true
        }
      });
    }
    
    // Send email with selected language
    try {
      await sendCatalogEmail(catalogLead, selectedLanguage);
      
      // Mark as sent successfully
      await catalogLead.markCatalogSent([selectedLanguage]);
      
      return NextResponse.json({
        success: true,
        message: 'Catalog email sent successfully',
        data: {
          leadId: catalogLead._id,
          emailSent: true,
          selectedLanguage
        }
      });
      
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      
      // Mark email as failed
      await catalogLead.markEmailFailed(emailError.message);
      
      return NextResponse.json({
        success: false,
        message: 'Failed to send catalog email',
        error: emailError.message
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('Send catalog email error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to process email request'
    }, { status: 500 });
  }
}

import mongoose from 'mongoose';

const emailSettingsSchema = new mongoose.Schema({
  // Email service configuration
  emailService: {
    type: String,
    enum: ['smtp', 'gmail', 'sendgrid', 'mailgun'],
    default: 'smtp',
    required: true
  },
  
  // SMTP Configuration
  smtpHost: {
    type: String,
    trim: true
  },
  smtpPort: {
    type: Number,
    default: 587
  },
  smtpSecure: {
    type: Boolean,
    default: false // true for 465, false for other ports
  },
  smtpUser: {
    type: String,
    trim: true
  },
  smtpPass: {
    type: String,
    trim: true
  },
  
  // Gmail Configuration
  gmailUser: {
    type: String,
    trim: true
  },
  gmailAppPassword: {
    type: String,
    trim: true
  },
  
  // General Email Settings
  fromEmail: {
    type: String,
    trim: true,
    default: 'noreply@dikafood.com'
  },
  fromName: {
    type: String,
    trim: true,
    default: 'DikaFood'
  },
  
  // Email Templates
  forgotPasswordSubject: {
    type: String,
    default: 'Réinitialisation de votre mot de passe - DikaFood'
  },
  
  // Test email settings
  testEmail: {
    type: String,
    trim: true
  },
  
  // Status
  isActive: {
    type: Boolean,
    default: true
  },
  lastTested: {
    type: Date
  },
  testStatus: {
    type: String,
    enum: ['success', 'failed', 'pending'],
    default: 'pending'
  },
  testError: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Ensure only one active configuration
emailSettingsSchema.index({ isActive: 1 }, { unique: true, partialFilterExpression: { isActive: true } });

const EmailSettings = mongoose.models.EmailSettings || mongoose.model('EmailSettings', emailSettingsSchema);

export default EmailSettings;

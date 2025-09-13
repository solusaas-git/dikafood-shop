import mongoose from 'mongoose';

const paymentMethodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Le nom de la méthode de paiement est requis'],
    trim: true,
    maxlength: [100, 'Le nom ne peut pas dépasser 100 caractères']
  },
  key: {
    type: String,
    required: [true, 'La clé de la méthode de paiement est requise'],
    unique: true,
    trim: true,
    lowercase: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'La description ne peut pas dépasser 500 caractères']
  },
  type: {
    type: String,
    required: [true, 'Le type de paiement est requis'],
    enum: {
      values: ['cash', 'card', 'bank_transfer', 'digital_wallet', 'other'],
      message: 'Type de paiement non valide'
    }
  },
  provider: {
    type: String,
    trim: true,
    maxlength: [100, 'Le nom du fournisseur ne peut pas dépasser 100 caractères']
  },
  fees: {
    type: {
      type: String,
      enum: ['fixed', 'percentage', 'none'],
      default: 'none'
    },
    amount: {
      type: Number,
      default: 0,
      min: [0, 'Les frais ne peuvent pas être négatifs']
    }
  },
  configuration: {
    // For bank transfer
    bankAccounts: [{
      bankName: String,
      accountHolder: String,
      accountNumber: String,
      rib: String,
      iban: String,
      swiftCode: String,
      hasQRCode: {
        type: Boolean,
        default: false
      },
      qrCodeUrl: String
    }],
    // For card payments (Stripe, etc.)
    apiKeys: {
      publicKey: String,
      secretKey: String,
      webhookSecret: String
    },
    // For digital wallets
    walletConfig: {
      merchantId: String,
      appId: String
    }
  },
  supportedCurrencies: [{
    type: String,
    default: ['MAD']
  }],
  minimumAmount: {
    type: Number,
    default: 0,
    min: [0, 'Le montant minimum ne peut pas être négatif']
  },
  maximumAmount: {
    type: Number,
    default: null
  },
  processingTime: {
    type: String,
    default: 'instant'
  },
  instructions: {
    type: String,
    trim: true,
    maxlength: [1000, 'Les instructions ne peuvent pas dépasser 1000 caractères']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  sortOrder: {
    type: Number,
    default: 0
  },
  icon: {
    type: String,
    default: 'credit-card'
  },
  logo: {
    type: String,
    trim: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes for better performance
paymentMethodSchema.index({ key: 1 });
paymentMethodSchema.index({ type: 1, isActive: 1 });
paymentMethodSchema.index({ sortOrder: 1 });

// Virtual for display name with fees
paymentMethodSchema.virtual('displayName').get(function() {
  let feeText = '';
  if (this.fees.type === 'fixed' && this.fees.amount > 0) {
    feeText = ` (+${this.fees.amount} MAD)`;
  } else if (this.fees.type === 'percentage' && this.fees.amount > 0) {
    feeText = ` (+${this.fees.amount}%)`;
  }
  
  return `${this.name}${feeText}`;
});

// Virtual for fee calculation
paymentMethodSchema.virtual('calculateFee').get(function() {
  return (amount) => {
    if (this.fees.type === 'fixed') {
      return this.fees.amount;
    } else if (this.fees.type === 'percentage') {
      return (amount * this.fees.amount) / 100;
    }
    return 0;
  };
});

// Ensure virtuals are included in JSON
paymentMethodSchema.set('toJSON', { virtuals: true });
paymentMethodSchema.set('toObject', { virtuals: true });

const PaymentMethod = mongoose.models.PaymentMethod || mongoose.model('PaymentMethod', paymentMethodSchema);

export default PaymentMethod;

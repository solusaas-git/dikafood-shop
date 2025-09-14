import mongoose from 'mongoose';

const citySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Le nom de la ville est requis'],
    trim: true,
    unique: true,
    maxlength: [100, 'Le nom de la ville ne peut pas dépasser 100 caractères']
  },
  nameArabic: {
    type: String,
    trim: true,
    maxlength: [100, 'Le nom arabe ne peut pas dépasser 100 caractères']
  },
  region: {
    type: String,
    required: [true, 'La région est requise'],
    trim: true,
    maxlength: [100, 'La région ne peut pas dépasser 100 caractères']
  },
  country: {
    type: String,
    required: [true, 'Le pays est requis'],
    enum: ['MA', 'FR', 'ES'],
    default: 'MA'
  },
  postalCode: {
    type: String,
    trim: true,
    maxlength: [10, 'Le code postal ne peut pas dépasser 10 caractères']
  },
  deliveryAvailable: {
    type: Boolean,
    default: true
  },
  deliveryFee: {
    type: Number,
    default: 0,
    min: [0, 'Les frais de livraison ne peuvent pas être négatifs']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  sortOrder: {
    type: Number,
    default: 0
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
// Note: name field already has unique index from schema definition
citySchema.index({ region: 1 });
citySchema.index({ isActive: 1, sortOrder: 1 });
citySchema.index({ deliveryAvailable: 1 });

// Virtual for display name
citySchema.virtual('displayName').get(function() {
  return this.nameArabic ? `${this.name} - ${this.nameArabic}` : this.name;
});

// Ensure virtual fields are serialized
citySchema.set('toJSON', { virtuals: true });
citySchema.set('toObject', { virtuals: true });

const City = mongoose.models.City || mongoose.model('City', citySchema);

export default City;

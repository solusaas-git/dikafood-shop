import mongoose from 'mongoose';

const deliveryMethodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Le nom de la méthode de livraison est requis'],
    trim: true,
    maxlength: [100, 'Le nom ne peut pas dépasser 100 caractères']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'La description ne peut pas dépasser 500 caractères']
  },
  type: {
    type: String,
    required: [true, 'Le type de livraison est requis'],
    enum: {
      values: ['delivery', 'pickup'],
      message: 'Le type doit être soit "delivery" soit "pickup"'
    }
  },
  price: {
    type: Number,
    required: [true, 'Le prix est requis'],
    min: [0, 'Le prix ne peut pas être négatif'],
    default: 0
  },
  estimatedTime: {
    min: {
      type: Number,
      required: [true, 'Le temps minimum est requis'],
      min: [0, 'Le temps minimum ne peut pas être négatif']
    },
    max: {
      type: Number,
      required: [true, 'Le temps maximum est requis'],
      min: [0, 'Le temps maximum ne peut pas être négatif']
    },
    unit: {
      type: String,
      enum: ['minutes', 'hours', 'days'],
      default: 'hours'
    }
  },
  availableCities: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'City'
  }],
  shops: [{
    name: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    phone: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  }],
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
    default: 'truck'
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
deliveryMethodSchema.index({ type: 1, isActive: 1 });
deliveryMethodSchema.index({ sortOrder: 1 });
deliveryMethodSchema.index({ availableCities: 1 });

// Virtual for display name with price
deliveryMethodSchema.virtual('displayName').get(function() {
  const priceText = this.price === 0 ? 'Gratuit' : `${this.price} MAD`;
  return `${this.name} - ${priceText}`;
});

// Virtual for time range display
deliveryMethodSchema.virtual('timeDisplay').get(function() {
  const unitText = {
    minutes: 'min',
    hours: 'h',
    days: 'j'
  };
  
  if (this.estimatedTime.min === this.estimatedTime.max) {
    return `${this.estimatedTime.min}${unitText[this.estimatedTime.unit]}`;
  }
  
  return `${this.estimatedTime.min}-${this.estimatedTime.max}${unitText[this.estimatedTime.unit]}`;
});

// Ensure virtuals are included in JSON
deliveryMethodSchema.set('toJSON', { virtuals: true });
deliveryMethodSchema.set('toObject', { virtuals: true });

const DeliveryMethod = mongoose.models.DeliveryMethod || mongoose.model('DeliveryMethod', deliveryMethodSchema);

export default DeliveryMethod;

import mongoose from 'mongoose';

const catalogLeadSchema = new mongoose.Schema({
  // Personal Information
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minLength: [2, 'Name must be at least 2 characters'],
    maxLength: [50, 'Name cannot exceed 50 characters']
  },
  
  surname: {
    type: String,
    required: [true, 'Surname is required'],
    trim: true,
    minLength: [2, 'Surname must be at least 2 characters'],
    maxLength: [50, 'Surname cannot exceed 50 characters']
  },
  
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      'Please provide a valid email address'
    ],
    maxLength: [100, 'Email cannot exceed 100 characters']
  },
  
  telephone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    match: [
      /^[\+]?[0-9\s\-\(\)]{8,20}$/,
      'Please provide a valid phone number'
    ]
  },

  // Catalog Information
  requestedLanguages: [{
    type: String,
    enum: ['fr', 'ar'],
    default: ['fr']
  }],
  
  catalogSentAt: {
    type: Date,
    default: null
  },
  
  emailSentSuccessfully: {
    type: Boolean,
    default: false
  },
  
  emailError: {
    type: String,
    default: null
  },

  // Metadata
  status: {
    type: String,
    enum: ['pending', 'sent', 'failed'],
    default: 'pending'
  },
  
  ipAddress: {
    type: String,
    default: null
  },
  
  userAgent: {
    type: String,
    default: null
  },
  
  source: {
    type: String,
    default: 'website_catalog_form'
  },
  
  // Admin notes
  adminNotes: {
    type: String,
    default: null
  },
  
  // Tracking
  viewedAt: {
    type: Date,
    default: null
  },
  
  viewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
catalogLeadSchema.index({ email: 1 });
catalogLeadSchema.index({ createdAt: -1 });
catalogLeadSchema.index({ status: 1 });
catalogLeadSchema.index({ catalogSentAt: -1 });

// Virtual for full name
catalogLeadSchema.virtual('fullName').get(function() {
  return `${this.name} ${this.surname}`;
});

// Virtual for formatted phone
catalogLeadSchema.virtual('formattedPhone').get(function() {
  if (!this.telephone) return '';
  
  // Basic phone formatting for display
  let phone = this.telephone.replace(/\D/g, '');
  if (phone.startsWith('212')) {
    // Moroccan number format
    return phone.replace(/(\d{3})(\d{1})(\d{2})(\d{2})(\d{2})/, '+$1 $2 $3 $4 $5');
  }
  return this.telephone;
});

// Static method to get leads with pagination and filters
catalogLeadSchema.statics.getLeadsWithPagination = async function(options = {}) {
  const {
    page = 1,
    limit = 20,
    status,
    search,
    dateFrom,
    dateTo,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = options;

  const query = {};

  // Status filter
  if (status && status !== 'all') {
    query.status = status;
  }

  // Search filter (name, surname, email, phone)
  if (search) {
    const searchRegex = { $regex: search, $options: 'i' };
    query.$or = [
      { name: searchRegex },
      { surname: searchRegex },
      { email: searchRegex },
      { telephone: searchRegex }
    ];
  }

  // Date range filter
  if (dateFrom || dateTo) {
    query.createdAt = {};
    if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
    if (dateTo) query.createdAt.$lte = new Date(dateTo);
  }

  const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };
  const skip = (page - 1) * limit;

  const [leads, totalCount] = await Promise.all([
    this.find(query)
      .populate('viewedBy', 'name email')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    this.countDocuments(query)
  ]);

  return {
    leads,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      totalCount,
      hasNextPage: page < Math.ceil(totalCount / limit),
      hasPrevPage: page > 1
    }
  };
};

// Instance method to mark as viewed by admin
catalogLeadSchema.methods.markAsViewed = function(adminUserId) {
  this.viewedAt = new Date();
  this.viewedBy = adminUserId;
  return this.save();
};

// Instance method to mark catalog as sent
catalogLeadSchema.methods.markCatalogSent = function(languages = ['fr']) {
  this.catalogSentAt = new Date();
  this.requestedLanguages = languages;
  this.emailSentSuccessfully = true;
  this.status = 'sent';
  this.emailError = null;
  return this.save();
};

// Instance method to mark email as failed
catalogLeadSchema.methods.markEmailFailed = function(error) {
  this.emailSentSuccessfully = false;
  this.status = 'failed';
  this.emailError = error;
  return this.save();
};

const CatalogLead = mongoose.models.CatalogLead || mongoose.model('CatalogLead', catalogLeadSchema);

export default CatalogLead;

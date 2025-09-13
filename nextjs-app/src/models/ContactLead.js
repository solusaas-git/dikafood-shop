import mongoose from 'mongoose';

const contactLeadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    trim: true,
    maxlength: [20, 'Phone number cannot exceed 20 characters']
  },
  subject: {
    type: String,
    trim: true,
    maxlength: [200, 'Subject cannot exceed 200 characters']
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    maxlength: [2000, 'Message cannot exceed 2000 characters']
  },
  source: {
    type: String,
    enum: ['landing', 'contact'],
    required: true,
    default: 'landing'
  },
  status: {
    type: String,
    enum: ['new', 'in_progress', 'resolved', 'closed'],
    default: 'new'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  },
  responseDate: {
    type: Date,
    default: null
  },
  isArchived: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for efficient queries
contactLeadSchema.index({ status: 1, createdAt: -1 });
contactLeadSchema.index({ email: 1 });
contactLeadSchema.index({ source: 1 });
contactLeadSchema.index({ isArchived: 1 });

// Virtual for formatted creation date
contactLeadSchema.virtual('formattedDate').get(function() {
  return this.createdAt.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
});

// Ensure virtual fields are serialized
contactLeadSchema.set('toJSON', { virtuals: true });

const ContactLead = mongoose.models.ContactLead || mongoose.model('ContactLead', contactLeadSchema);

export default ContactLead;

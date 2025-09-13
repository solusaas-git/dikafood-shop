import { NextResponse } from 'next/server';
import connectDB from '../../../lib/database.js';
import ContactLead from '../../../models/ContactLead.js';

// POST - Create a new contact lead
export async function POST(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { name, email, phone, subject, message, source = 'landing' } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Name, email, and message are required' 
        },
        { status: 400 }
      );
    }

    // Create new contact lead
    const contactLead = new ContactLead({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || '',
      subject: subject?.trim() || '',
      message: message.trim(),
      source,
      status: 'new',
      priority: 'medium'
    });

    await contactLead.save();

    return NextResponse.json({
      success: true,
      message: 'Contact lead saved successfully',
      data: {
        id: contactLead._id,
        name: contactLead.name,
        email: contactLead.email,
        source: contactLead.source,
        createdAt: contactLead.createdAt
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Contact lead creation error:', error);
    
    if (error.name === 'ValidationError') {
      const errorMessages = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { 
          success: false, 
          message: 'Validation error',
          errors: errorMessages
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

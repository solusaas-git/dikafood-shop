import { NextResponse } from 'next/server';
import connectDB from '../../../../../lib/database.js';
import ContactLead from '../../../../../models/ContactLead.js';
import { authenticate } from '../../../../../lib/auth.js';

// PUT - Update contact lead status/details (admin only)
export async function PUT(request, { params }) {
  try {
    // Verify admin authentication
    const user = await authenticate(request);
    if (!user || !['admin', 'manager', 'sales'].includes(user.role)) {
      return NextResponse.json({ 
        success: false, 
        message: 'Access denied' 
      }, { status: 403 });
    }

    await connectDB();

    const { id } = params;
    const body = await request.json();
    const { status, priority, assignedTo, notes, responseDate } = body;

    // Find and update the contact lead
    const updateData = {};
    
    if (status) updateData.status = status;
    if (priority) updateData.priority = priority;
    if (assignedTo !== undefined) updateData.assignedTo = assignedTo || null;
    if (notes !== undefined) updateData.notes = notes;
    if (responseDate !== undefined) updateData.responseDate = responseDate ? new Date(responseDate) : null;

    const contactLead = await ContactLead.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('assignedTo', 'firstName lastName email');

    if (!contactLead) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Contact lead not found' 
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Contact lead updated successfully',
      data: contactLead
    });

  } catch (error) {
    console.error('Contact lead update error:', error);
    
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
        message: 'Failed to update contact lead' 
      },
      { status: 500 }
    );
  }
}

// DELETE - Archive contact lead (admin only)
export async function DELETE(request, { params }) {
  try {
    // Verify admin authentication
    const user = await authenticate(request);
    if (!user || !['admin', 'manager', 'sales'].includes(user.role)) {
      return NextResponse.json({ 
        success: false, 
        message: 'Access denied' 
      }, { status: 403 });
    }

    await connectDB();

    const { id } = params;

    // Archive instead of delete
    const contactLead = await ContactLead.findByIdAndUpdate(
      id,
      { isArchived: true },
      { new: true }
    );

    if (!contactLead) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Contact lead not found' 
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Contact lead archived successfully'
    });

  } catch (error) {
    console.error('Contact lead archive error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to archive contact lead' 
      },
      { status: 500 }
    );
  }
}

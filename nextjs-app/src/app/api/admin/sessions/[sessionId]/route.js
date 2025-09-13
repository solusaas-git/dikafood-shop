import { NextResponse } from 'next/server';
import { authenticateWithSession, revokeUserSession } from '../../../../../lib/sessionAuth.js';
import Session from '../../../../../models/Session.js';
import connectDB from '../../../../../lib/database.js';
import mongoose from 'mongoose';

// GET /api/admin/sessions/[sessionId] - Get single session details
export async function GET(request, { params }) {
  try {
    const auth = await authenticateWithSession(request);

    if (!['admin', 'manager'].includes(auth.user.role)) {
      return NextResponse.json(
        { success: false, message: 'Access denied. Admin or Manager role required.' },
        { status: 403 }
      );
    }

    await connectDB();
    const { sessionId } = await params;

    const session = await Session.findOne({ sessionId })
      .populate('userId', 'firstName lastName email role userType phone')
      .lean();

    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Session not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: session
    });

  } catch (error) {
    console.error('Get session error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch session' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/sessions/[sessionId] - Revoke/terminate session
export async function DELETE(request, { params }) {
  try {
    const auth = await authenticateWithSession(request);

    if (!['admin', 'manager'].includes(auth.user.role)) {
      return NextResponse.json(
        { success: false, message: 'Access denied. Admin or Manager role required.' },
        { status: 403 }
      );
    }

    const { sessionId } = await params;

    // Get reason from request body
    let reason = 'admin_revoked';
    try {
      const body = await request.json();
      if (body.reason) {
        reason = body.reason;
      }
    } catch (e) {
      // Body is optional
    }

    await revokeUserSession(sessionId, reason);

    return NextResponse.json({
      success: true,
      message: 'Session revoked successfully'
    });

  } catch (error) {
    console.error('Revoke session error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to revoke session' },
      { status: 500 }
    );
  }
}

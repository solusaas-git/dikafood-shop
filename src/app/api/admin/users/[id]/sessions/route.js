import { NextResponse } from 'next/server';
import { authenticateWithSession, getUserSessions, revokeAllUserSessions } from '../../../../../../lib/sessionAuth.js';
import connectDB from '../../../../../../lib/database.js';
import mongoose from 'mongoose';

// GET /api/admin/users/[id]/sessions - Get all sessions for a user
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
    const { id: userId } = await params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ success: false, message: 'Invalid user ID' }, { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('activeOnly') !== 'false'; // Default to true

    const sessions = await getUserSessions(userId, activeOnly);

    return NextResponse.json({
      success: true,
      data: sessions
    });

  } catch (error) {
    console.error('Get user sessions error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch user sessions' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/users/[id]/sessions - Revoke all sessions for a user
export async function DELETE(request, { params }) {
  try {
    const auth = await authenticateWithSession(request);

    if (!['admin'].includes(auth.user.role)) {
      return NextResponse.json(
        { success: false, message: 'Access denied. Admin role required.' },
        { status: 403 }
      );
    }

    await connectDB();
    const { id: userId } = await params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ success: false, message: 'Invalid user ID' }, { status: 400 });
    }

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

    const result = await revokeAllUserSessions(userId, reason);

    return NextResponse.json({
      success: true,
      message: 'All user sessions revoked successfully',
      data: result
    });

  } catch (error) {
    console.error('Revoke all user sessions error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to revoke user sessions' },
      { status: 500 }
    );
  }
}

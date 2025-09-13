import { NextResponse } from 'next/server';
import { authenticateWithSession } from '../../../../lib/sessionAuth.js';
import Session from '../../../../models/Session.js';
import connectDB from '../../../../lib/database.js';

// GET /api/admin/sessions - Get all sessions with filtering
export async function GET(request) {
  try {
    const auth = await authenticateWithSession(request);

    if (!['admin', 'manager'].includes(auth.user.role)) {
      return NextResponse.json(
        { success: false, message: 'Access denied. Admin or Manager role required.' },
        { status: 403 }
      );
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const sessionType = searchParams.get('sessionType'); // 'guest' | 'authenticated'
    const isActive = searchParams.get('isActive');
    const userId = searchParams.get('userId');
    const ipAddress = searchParams.get('ipAddress');
    const sortBy = searchParams.get('sortBy') || 'lastActivity';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Build filter object
    const filter = {};

    if (sessionType) {
      filter.sessionType = sessionType;
    }

    if (isActive !== null && isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }

    if (userId) {
      filter.userId = userId;
    }

    if (ipAddress) {
      filter.ipAddress = new RegExp(ipAddress, 'i');
    }

    // Get sessions with pagination
    const skip = (page - 1) * limit;
    const sessions = await Session.find(filter)
      .populate('userId', 'firstName lastName email role userType')
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const totalSessions = await Session.countDocuments(filter);
    const totalPages = Math.ceil(totalSessions / limit);

    // Calculate statistics
    const stats = await Session.aggregate([
      {
        $group: {
          _id: null,
          totalSessions: { $sum: 1 },
          activeSessions: {
            $sum: { 
              $cond: [
                { 
                  $and: [
                    { $eq: ['$isActive', true] },
                    { $gt: ['$expiresAt', new Date()] }
                  ]
                }, 
                1, 
                0
              ] 
            }
          },
          authenticatedSessions: {
            $sum: { $cond: [{ $eq: ['$sessionType', 'authenticated'] }, 1, 0] }
          },
          guestSessions: {
            $sum: { $cond: [{ $eq: ['$sessionType', 'guest'] }, 1, 0] }
          },
          uniqueUsers: { $addToSet: '$userId' },
          uniqueIPs: { $addToSet: '$ipAddress' }
        }
      }
    ]);

    const sessionStats = stats[0] || {
      totalSessions: 0,
      activeSessions: 0,
      authenticatedSessions: 0,
      guestSessions: 0,
      uniqueUsers: [],
      uniqueIPs: []
    };

    sessionStats.uniqueUserCount = sessionStats.uniqueUsers.filter(Boolean).length;
    sessionStats.uniqueIPCount = sessionStats.uniqueIPs.length;
    delete sessionStats.uniqueUsers;
    delete sessionStats.uniqueIPs;

    return NextResponse.json({
      success: true,
      data: {
        sessions,
        pagination: {
          currentPage: page,
          totalPages,
          totalSessions,
          limit
        },
        stats: sessionStats
      }
    });

  } catch (error) {
    console.error('Get sessions error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch sessions' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/sessions - Cleanup expired sessions
export async function DELETE(request) {
  try {
    const auth = await authenticateWithSession(request);

    if (!['admin'].includes(auth.user.role)) {
      return NextResponse.json(
        { success: false, message: 'Access denied. Admin role required.' },
        { status: 403 }
      );
    }

    await connectDB();

    const result = await Session.cleanupExpiredSessions();

    return NextResponse.json({
      success: true,
      message: 'Expired sessions cleaned up',
      data: {
        deletedCount: result.deletedCount
      }
    });

  } catch (error) {
    console.error('Cleanup sessions error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to cleanup sessions' },
      { status: 500 }
    );
  }
}

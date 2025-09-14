import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/database.js';
import ContactLead from '../../../../models/ContactLead.js';
import User from '../../../../models/User.js';
import { authenticate } from '../../../../lib/auth.js';

// GET - Fetch contact leads (admin only)
export async function GET(request) {
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

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const status = searchParams.get('status');
    const source = searchParams.get('source');
    const priority = searchParams.get('priority');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Build filter query
    const filter = { isArchived: false };
    
    if (status && status !== 'all') {
      filter.status = status;
    }
    
    if (source && source !== 'all') {
      filter.source = source;
    }
    
    if (priority && priority !== 'all') {
      filter.priority = priority;
    }
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Fetch contact leads with pagination
    const [contactLeads, total] = await Promise.all([
      ContactLead.find(filter)
        .populate('assignedTo', 'firstName lastName email')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      ContactLead.countDocuments(filter)
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    // Get summary statistics
    const stats = await ContactLead.aggregate([
      { $match: { isArchived: false } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const statusCounts = {
      new: 0,
      in_progress: 0,
      resolved: 0,
      closed: 0
    };

    stats.forEach(stat => {
      statusCounts[stat._id] = stat.count;
    });

    return NextResponse.json({
      success: true,
      data: {
        contactLeads,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: total,
          itemsPerPage: limit,
          hasNextPage,
          hasPreviousPage
        },
        stats: {
          total,
          ...statusCounts
        }
      }
    });

  } catch (error) {
    console.error('Contact leads fetch error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch contact leads' 
      },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/database.js';
import Product from '../../../../models/Product.js';
import { withCache } from '../../../../lib/cache.js';

async function getCategoriesHandler(req) {
  try {
    await connectDB();
    
    // Get all unique categories from active products
    const categories = await Product.aggregate([
      {
        $match: { 
          status: 'active',
          categoryName: { $exists: true, $ne: null }
        }
      },
      {
        $group: {
          _id: '$categoryName',
          count: { $sum: 1 },
          name: { $first: '$categoryName' }
        }
      },
      {
        $project: {
          _id: 0,
          name: '$name',
          productCount: '$count'
        }
      },
      {
        $sort: { name: 1 }
      }
    ]);

    return NextResponse.json({
      success: true,
      message: 'Categories retrieved successfully',
      data: categories
    });

  } catch (error) {
    console.error('Get categories error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to retrieve categories',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    }, { status: 500 });
  }
}

// Export cached version with 5 minute cache
export const GET = withCache(getCategoriesHandler, 5 * 60 * 1000);

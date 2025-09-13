import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/database.js';
import Product from '../../../../models/Product.js';
import Brand from '../../../../models/Brand.js';
import { withCache } from '../../../../lib/cache.js';

async function getBrandsHandler(req) {
  try {
    await connectDB();
    
    // Single optimized aggregation query to get brands with product counts
    const brandsWithCounts = await Product.aggregate([
      {
        $match: { 
          status: 'active',
          brand: { $exists: true, $ne: null }
        }
      },
      {
        $group: {
          _id: '$brand',
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'brands',
          localField: '_id',
          foreignField: '_id',
          as: 'brandInfo'
        }
      },
      {
        $unwind: '$brandInfo'
      },
      {
        $match: {
          'brandInfo.isActive': true
        }
      },
      {
        $project: {
          _id: '$brandInfo._id',
          name: '$brandInfo.name',
          slug: '$brandInfo.slug',
          logo: '$brandInfo.logo',
          productCount: '$count'
        }
      },
      {
        $sort: { name: 1 }
      }
    ]);

    // Transform brands for frontend
    const transformedBrands = brandsWithCounts.map(brand => ({
      id: brand._id.toString(),
      name: brand.name,
      displayName: brand.name,
      slug: brand.slug,
      logo: brand.logo || {
        url: '/images/brands/placeholder-logo.svg',
        alt: `${brand.name} logo`
      },
      productCount: brand.productCount || 0
    }));

    return NextResponse.json({
      success: true,
      message: 'Brands retrieved successfully',
      data: transformedBrands
    });

  } catch (error) {
    console.error('Get brands error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to retrieve brands',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    }, { status: 500 });
  }
}

// Export cached version with 5 minute cache  
export const GET = withCache(getBrandsHandler, 5 * 60 * 1000);

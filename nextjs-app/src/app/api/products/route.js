import { NextResponse } from 'next/server';
import connectDB from '../../../lib/database.js';
import Product from '../../../models/Product.js';

export async function GET(req) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');
    const category = searchParams.get('category');
    const brand = searchParams.get('brand');
    const sortBy = searchParams.get('sortBy');
    const sortDirection = searchParams.get('sortDirection') || 'asc';
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 50;

    // Build filter object
    const filter = { 
      // Only show products that are published/available to customers
      status: 'active'
    };

    // Text search
    if (query) {
      filter.$or = [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { brandDisplayName: { $regex: query, $options: 'i' } }
      ];
    }

    // Category filter
    if (category) {
      filter.categoryName = category;
    }

    // Brand filter
    if (brand) {
      filter.brandDisplayName = brand;
    }

    // Price range filter - we'll filter this after fetching since prices are in variants
    // if (minPrice || maxPrice) {
    //   filter['variants.price'] = {};
    //   if (minPrice) filter['variants.price'].$gte = parseFloat(minPrice);
    //   if (maxPrice) filter['variants.price'].$lte = parseFloat(maxPrice);
    // }

    // Build sort object
    let sort = { createdAt: -1 }; // Default sort
    if (sortBy) {
      const direction = sortDirection === 'desc' ? -1 : 1;
      sort = { [sortBy]: direction };
    }

    // Execute query with pagination
    const skip = (page - 1) * limit;
    const [products, totalCount] = await Promise.all([
      Product.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(filter)
    ]);

    // Transform products for frontend
    const transformedProducts = products.map(product => {
      // Get the lowest price from variants for the main price (consider promotional prices)
      const lowestPrice = product.variants && product.variants.length > 0 
        ? Math.min(...product.variants.map(v => {
            // Use promotional price if it exists and is valid, otherwise use regular price
            const promoPrice = v.promotionalPrice;
            const regularPrice = v.price || 0;
            return (promoPrice && promoPrice > 0 && promoPrice < regularPrice) ? promoPrice : regularPrice;
          }))
        : 0;

      // Get primary image
      const primaryImage = product.images?.find(img => img.isPrimary)?.url || 
                          product.images?.[0]?.url || 
                          null;

      return {
        _id: product._id,
        id: product._id,
        name: product.name,
        title: product.name, // For compatibility
        description: product.description,
        shortDescription: product.shortDescription,
        price: lowestPrice,
        unitPrice: lowestPrice, // For compatibility
        category: product.categoryName || product.category?.name || product.category,
        brand: product.brandDisplayName || product.brand?.name || product.brand,
        brandName: product.brandDisplayName || product.brand?.name || product.brand, // For compatibility
        images: product.images?.map(img => img.url) || [],
        image: primaryImage, // For compatibility
        variants: (product.variants || []).map((variant, index) => {
          // Use variant's own imageUrls first (this is the correct source)
          let variantImageUrl = null;
          
          // Check if variant has its own imageUrls array
          if (variant.imageUrls && variant.imageUrls.length > 0) {
            variantImageUrl = variant.imageUrls[0]; // Use first image from variant's own images
          }
          
          // Fallback to variant.imageUrl if it exists
          if (!variantImageUrl && variant.imageUrl) {
            variantImageUrl = variant.imageUrl;
          }
          
          // Last resort: use primary image or default
          if (!variantImageUrl) {
            variantImageUrl = primaryImage || '/images/products/dika-500ML.webp';
          }
          
          return {
            ...variant,
            imageUrl: variantImageUrl
          };
        }),
        status: product.status,
        isActive: product.status === 'active', // Derive from status
        stock: product.variants?.reduce((total, variant) => total + (variant.stock || 0), 0) || 0,
        sku: product.sku,
        tags: product.tags || [],
        features: product.features || [],
        allergens: product.allergens || [],
        slug: product.slug,
        featured: product.featured,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt
      };
    });

    return NextResponse.json({
      success: true,
      message: 'Products retrieved successfully',
      data: {
        products: transformedProducts,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalCount / limit),
          totalCount,
          hasNextPage: page < Math.ceil(totalCount / limit),
          hasPreviousPage: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Get products error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to retrieve products',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    }, { status: 500 });
  }
}

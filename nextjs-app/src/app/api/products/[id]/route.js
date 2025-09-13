import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/database.js';
import Product from '../../../../models/Product.js';

export async function GET(req, { params }) {
  try {
    await connectDB();
    
    const { id } = await params;

    // Try to find product by slug first (SEO-friendly), then by ID (fallback)
    let product = await Product.findOne({ 
      slug: id, 
      status: 'active'
    }).lean();

    // If not found by slug, try by ID (for backward compatibility)
    if (!product) {
      // Check if the id looks like a MongoDB ObjectId (24 hex characters)
      const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);
      
      if (isObjectId) {
        product = await Product.findOne({ 
          _id: id, 
          status: 'active'
        }).lean();
      }
    }

    if (!product) {
      return NextResponse.json({
        success: false,
        message: 'Product not found'
      }, { status: 404 });
    }

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

    // Transform product for frontend
    const transformedProduct = {
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
      specifications: product.specifications || {},
      nutritionalInfo: product.nutritionalInfo || {},
      createdAt: product.createdAt,
      updatedAt: product.updatedAt
    };

    return NextResponse.json({
      success: true,
      message: 'Product retrieved successfully',
      data: transformedProduct
    });

  } catch (error) {
    console.error('Get product error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to retrieve product',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    }, { status: 500 });
  }
}

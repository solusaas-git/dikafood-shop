import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/database.js';
import Product from '../../../../models/Product.js';

export async function GET(req) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit')) || 8;
    const type = searchParams.get('type') || 'products'; // 'products' or 'variants'

    if (type === 'variants') {
      // Get products that have featured variants
      const products = await Product.find({ 
        status: 'active',
        'variants.featured': true // Find products with at least one featured variant
      })
        .sort({ createdAt: -1 }) // Most recent first
        .lean();

      // Group featured variants by product to avoid duplicates
      const featuredProducts = [];
      
      products.forEach(product => {
        const productFeaturedVariants = product.variants.filter(variant => 
          variant.featured && variant.isActive !== false && variant.stock > 0
        );
        
        // Only include products that have featured variants
        if (productFeaturedVariants.length > 0) {
          // Use the first featured variant as the default display variant
          const defaultVariant = productFeaturedVariants[0];
          
          // Get primary image (from default variant or product)
          const primaryImage = defaultVariant.imageUrl || 
                              defaultVariant.imageUrls?.[0] || 
                              product.images?.find(img => img.isPrimary)?.url || 
                              product.images?.[0]?.url || 
                              null;

          featuredProducts.push({
            _id: product._id,
            id: product._id,
            productId: product._id,
            name: product.name,
            productName: product.name,
            title: product.name,
            description: product.description,
            shortDescription: product.shortDescription,
            // Use the default variant's pricing
            price: defaultVariant.promotionalPrice && defaultVariant.promotionalPrice > 0 && defaultVariant.promotionalPrice < defaultVariant.price 
                   ? defaultVariant.promotionalPrice 
                   : defaultVariant.price,
            originalPrice: defaultVariant.price,
            promotionalPrice: defaultVariant.promotionalPrice,
            category: product.categoryName || product.category?.name || product.category,
            brand: product.brandDisplayName || product.brand?.name || product.brand,
            brandName: product.brandDisplayName || product.brand?.name || product.brand,
            image: primaryImage,
            images: product.images?.map(img => img.url) || [primaryImage].filter(Boolean),
            tags: product.tags || [],
            features: product.features || [],
            allergens: product.allergens || [],
            slug: product.slug,
            featured: true,
            status: product.status,
            isActive: product.status === 'active',
            // Include all variants for variant selector, but mark featured ones
            variants: product.variants.map(variant => ({
              ...variant,
              imageUrl: variant.imageUrl || 
                       variant.imageUrls?.[0] || 
                       primaryImage || 
                       '/images/products/dika-500ML.webp'
            }))
          });
        }
      });

      // Limit the results
      const limitedProducts = featuredProducts.slice(0, limit);

      return NextResponse.json({
        success: true,
        message: 'Featured products retrieved successfully',
        data: limitedProducts
      });
    }

    // Original featured products logic
    const products = await Product.find({ 
      status: 'active',
      featured: true // Use the featured field from the database
    })
      .sort({ createdAt: -1 }) // Most recent first
      .limit(limit)
      .lean();

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
        variants: product.variants || [],
        status: product.status,
        isActive: product.status === 'active', // Derive from status
        stock: product.variants?.reduce((total, variant) => total + (variant.stock || 0), 0) || 0,
        sku: product.sku,
        tags: product.tags || [],
        slug: product.slug,
        featured: product.featured
      };
    });

    return NextResponse.json({
      success: true,
      message: 'Featured products retrieved successfully',
      data: transformedProducts
    });

  } catch (error) {
    console.error('Get featured products error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to retrieve featured products',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    }, { status: 500 });
  }
}

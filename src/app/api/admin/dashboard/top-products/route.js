import { NextResponse } from 'next/server';
import { authenticate } from '../../../../../lib/auth';
import connectDB from '../../../../../lib/database';

export async function GET(request) {
  try {
    const user = await authenticate(request);

    if (!['admin', 'manager'].includes(user.role)) {
      return NextResponse.json(
        { success: false, message: 'Access denied' },
        { status: 403 }
      );
    }

    await connectDB();

    // Import models
    const Order = (await import('../../../../../models/Order')).default;
    const Product = (await import('../../../../../models/Product')).default;

    // Aggregate top ordered product variants
    const topProducts = await Order.aggregate([
      // Match only confirmed and completed orders
      { 
        $match: { 
          status: { $in: ['confirmed', 'processing', 'shipped', 'delivered'] },
          items: { $exists: true, $ne: [] }
        } 
      },
      // Unwind the items array to process each item separately
      { $unwind: '$items' },
      // Group by product and variant to get total quantities and unique orders
      {
        $group: {
          _id: {
            productId: '$items.product',
            variant: '$items.variant'
          },
          totalOrdered: { $sum: '$items.quantity' }, // Sum of all quantities across all orders
          uniqueOrders: { $addToSet: '$_id' } // Track unique order IDs that contain this variant
        }
      },
      // Calculate unique order count
      {
        $addFields: {
          orderCount: { $size: '$uniqueOrders' } // Count of unique orders
        }
      },
      // Clean up - remove debug fields
      {
        $project: {
          _id: 1,
          totalOrdered: 1,
          orderCount: 1
        }
      },
      // Sort by total quantity ordered (descending)
      { $sort: { totalOrdered: -1 } },
      // Limit to top 10
      { $limit: 10 },
      // Lookup product details
      {
        $lookup: {
          from: 'products',
          localField: '_id.productId',
          foreignField: '_id',
          as: 'productDetails'
        }
      },
      // Unwind product details
      { $unwind: { path: '$productDetails', preserveNullAndEmptyArrays: true } },
      // Project the final structure
      {
        $project: {
          productId: '$_id.productId',
          variant: '$_id.variant',
          totalOrdered: 1, // Total units sold
          orderCount: 1, // Unique order count (already calculated)
          productName: '$productDetails.name',
          productImages: '$productDetails.images', // All images
          productVariants: '$productDetails.variants', // All variants
          productPrice: '$productDetails.price',
          productBrand: '$productDetails.brandDisplayName',
          productCategory: '$productDetails.categoryName'
        }
      }
    ]);


    // Format the data for the dashboard
    const formattedProducts = topProducts.map((item, index) => {
      // Handle variant data properly
      let variantString = 'Default';
      let variantImage = null;
      
      if (item.variant) {
        if (typeof item.variant === 'string') {
          variantString = item.variant;
        } else if (typeof item.variant === 'object') {
          // Extract meaningful info from variant object (size, type, etc.)
          variantString = item.variant.size || item.variant.type || item.variant.name || 'Variant';
          
          // First, check if the variant object already has imageUrl or imageUrls (from order storage)
          if (item.variant.imageUrl) {
            variantImage = item.variant.imageUrl;
          } else if (item.variant.imageUrls && item.variant.imageUrls.length > 0) {
            variantImage = item.variant.imageUrls[0];
          } else {
            // If not, try to find matching variant in product variants by size and sku
            if (item.productVariants && Array.isArray(item.productVariants)) {
              const matchingVariant = item.productVariants.find(v => {
                // Match by size first (most reliable)
                if (item.variant.size && v.size === item.variant.size) {
                  return true;
                }
                // Match by SKU if available
                if (item.variant.sku && v.sku === item.variant.sku) {
                  return true;
                }
                return false;
              });
              
              if (matchingVariant) {
                // Get variant image from product variant
                variantImage = matchingVariant.imageUrl || (matchingVariant.imageUrls && matchingVariant.imageUrls[0]);
              }
            }
          }
        }
      }

      // Determine the best image to use
      let productImage = null;
      
      // Priority: 1. Variant image, 2. Primary product image, 3. First product image
      if (variantImage) {
        productImage = variantImage;
      } else if (item.productImages && Array.isArray(item.productImages)) {
        // Find primary image
        const primaryImage = item.productImages.find(img => img.isPrimary);
        if (primaryImage && primaryImage.url) {
          productImage = primaryImage.url;
        } else if (item.productImages[0] && item.productImages[0].url) {
          // Fallback to first image
          productImage = item.productImages[0].url;
        }
      }

      return {
        id: item.productId?.toString() || 'unknown',
        name: item.productName || 'Unknown Product',
        variant: variantString,
        variantId: item.variant ? JSON.stringify(item.variant) : 'default', // For unique keys
        image: productImage || '/images/placeholder-brand.svg', // Use existing placeholder
        totalOrdered: item.totalOrdered,
        orderCount: item.orderCount,
        price: item.productPrice || 0,
        brand: item.productBrand || 'Unknown Brand',
        category: item.productCategory || 'Unknown Category',
        rank: index + 1 // Add rank for unique identification
      };
    });

    return NextResponse.json({
      success: true,
      data: formattedProducts
    });

  } catch (error) {
    console.error('Top products error:', error);
    
    // Handle authentication errors
    if (error.message?.includes('Authentication') || error.message?.includes('No authentication')) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

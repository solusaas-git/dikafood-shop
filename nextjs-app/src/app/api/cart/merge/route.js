import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/database.js';
import Cart from '../../../../models/Cart.js';
import { authenticateWithSession } from '../../../../lib/sessionAuth.js';

// POST /api/cart/merge - Handle cart conflicts and merging
export async function POST(req) {
  try {
    await connectDB();
    
    const body = await req.json();
    const { strategy, guestSessionId } = body;
    
    // Validate strategy
    const validStrategies = ['merge', 'replace', 'keep_existing'];
    if (!strategy || !validStrategies.includes(strategy)) {
      return NextResponse.json({
        success: false,
        message: 'Valid merge strategy is required (merge, replace, keep_existing)'
      }, { status: 400 });
    }
    
    // Require authentication for merge operations
    const authResult = await authenticateWithSession(req);
    if (!authResult.success) {
      return NextResponse.json({
        success: false,
        message: 'Authentication required for cart merge operations'
      }, { status: 401 });
    }
    
    const user = authResult.user;
    const userId = user.role === 'customer' ? null : user._id;
    const customerId = user.role === 'customer' ? user._id : user.customerId;
    
    console.log('🔄 Cart merge operation:', {
      strategy,
      guestSessionId,
      userId,
      customerId,
      userRole: user.role
    });
    
    // Find authenticated user's cart
    let userCart = await Cart.findActiveCart(userId, customerId, null);
    
    // Find guest cart if sessionId provided
    let guestCart = null;
    if (guestSessionId) {
      guestCart = await Cart.findActiveCart(null, null, guestSessionId);
    }
    
    // If no user cart exists, create one
    if (!userCart) {
      const type = user.role === 'customer' ? 'customer' : 'user';
      userCart = await Cart.createCart(userId, customerId, null, type);
      console.log('🆕 Created new authenticated user cart');
    }
    
    // Handle different scenarios
    if (!guestCart || guestCart.isEmpty) {
      // No guest cart or empty guest cart - nothing to merge
      console.log('ℹ️ No guest cart to merge or guest cart is empty');
      
      await userCart.populate([
        {
          path: 'items.product',
          select: 'name slug images status'
        }
      ]);
      
      return NextResponse.json({
        success: true,
        message: 'No cart merge needed',
        data: {
          cart: formatCartResponse(userCart),
          mergeInfo: {
            strategy: 'none',
            itemsFromGuest: 0,
            totalItems: userCart.itemCount
          }
        }
      });
    }
    
    // Track merge statistics
    const beforeMerge = {
      userItems: userCart.itemCount,
      guestItems: guestCart.itemCount
    };
    
    // Perform merge based on strategy
    switch (strategy) {
      case 'merge':
        console.log('🔄 Merging guest cart into user cart');
        await userCart.mergeCarts(guestCart, 'merge');
        break;
        
      case 'replace':
        console.log('🔄 Replacing user cart with guest cart');
        await userCart.mergeCarts(guestCart, 'replace');
        break;
        
      case 'keep_existing':
        console.log('🔄 Keeping existing user cart, discarding guest cart');
        await userCart.mergeCarts(guestCart, 'keep_existing');
        break;
    }
    
    // Mark guest cart as merged
    guestCart.status = 'merged';
    await guestCart.save();
    
    // Populate and return updated cart
    await userCart.populate([
      {
        path: 'items.product',
        select: 'name slug images status'
      }
    ]);
    
    const afterMerge = {
      totalItems: userCart.itemCount
    };
    
    console.log('✅ Cart merge completed:', {
      strategy,
      before: beforeMerge,
      after: afterMerge
    });
    
    return NextResponse.json({
      success: true,
      message: 'Cart merge completed successfully',
      data: {
        cart: formatCartResponse(userCart),
        mergeInfo: {
          strategy,
          itemsFromGuest: beforeMerge.guestItems,
          itemsFromUser: beforeMerge.userItems,
          totalItems: afterMerge.totalItems
        }
      }
    });
    
  } catch (error) {
    console.error('Cart merge error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to merge carts',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    }, { status: 500 });
  }
}

// Helper function to format cart response
function formatCartResponse(cart) {
  return {
    id: cart._id,
    items: cart.items.map(item => ({
      id: item._id,
      product: {
        id: item.product._id,
        name: item.product.name,
        slug: item.product.slug,
        image: item.product.images?.[0]?.url || item.productData?.image
      },
      variant: {
        id: item.variant,
        size: item.variantData?.size,
        sku: item.variantData?.sku,
        price: item.variantData?.price,
        promotionalPrice: item.variantData?.promotionalPrice,
        imageUrl: item.variantData?.imageUrl,
        imageUrls: item.variantData?.imageUrls
      },
      quantity: item.quantity,
      price: item.price,
      total: item.price * item.quantity
    })),
    subtotal: cart.subtotal,
    itemCount: cart.itemCount,
    currency: cart.currency,
    isEmpty: cart.isEmpty
  };
}

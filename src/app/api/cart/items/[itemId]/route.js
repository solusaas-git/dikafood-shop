import { NextResponse } from 'next/server';
import connectDB from '../../../../../lib/database.js';
import Cart from '../../../../../models/Cart.js';
import { optionalAuthWithSession } from '../../../../../lib/sessionAuth.js';

// PUT /api/cart/items/[itemId] - Update cart item quantity
export async function PUT(req, { params }) {
  try {
    await connectDB();
    
    const { itemId } = await params;
    const body = await req.json();
    const { quantity } = body;
    
    // Validate quantity
    if (quantity === undefined || quantity < 0) {
      return NextResponse.json({
        success: false,
        message: 'Valid quantity is required'
      }, { status: 400 });
    }
    
    // Get user authentication (optional - supports guest carts)
    const authResult = await optionalAuthWithSession(req);
    const user = authResult?.user;
    const sessionId = authResult?.sessionId;
    
    // Find user's cart
    let cart = null;
    
    if (user) {
      const userId = user.role === 'customer' ? null : user._id;
      const customerId = user.role === 'customer' ? user._id : user.customerId;
      cart = await Cart.findActiveCart(userId, customerId, null);
    } else if (sessionId) {
      cart = await Cart.findActiveCart(null, null, sessionId);
    }
    
    if (!cart) {
      return NextResponse.json({
        success: false,
        message: 'Cart not found'
      }, { status: 404 });
    }
    
    // Update item quantity (this will remove item if quantity is 0)
    try {
      if (quantity === 0) {
        await cart.removeItem(itemId);
      } else {
        await cart.updateItemQuantity(itemId, quantity);
      }
    } catch (error) {
      if (error.message === 'Item not found in cart') {
        return NextResponse.json({
          success: false,
          message: 'Cart item not found'
        }, { status: 404 });
      }
      throw error;
    }
    
    // Return updated cart
    await cart.populate([
      {
        path: 'items.product',
        select: 'name slug images status variants'
      }
    ]);
    
    return NextResponse.json({
      success: true,
      message: quantity === 0 ? 'Item removed from cart' : 'Cart item updated successfully',
      data: {
        cart: {
          id: cart._id,
          items: cart.items.map(item => {
            // Find the actual variant from the populated product data
            const actualVariant = item.product?.variants?.find(v => 
              v._id.toString() === item.variant.toString()
            );
            
            return {
              id: item._id,
              product: {
                id: item.product._id,
                name: item.product.name,
                slug: item.product.slug,
                image: item.product.images?.[0]?.url || item.productData?.image
              },
              variant: {
                id: item.variant,
                size: actualVariant?.size || item.variantData?.size,
                sku: actualVariant?.sku || item.variantData?.sku,
                price: actualVariant?.price || item.variantData?.price,
                promotionalPrice: actualVariant?.promotionalPrice || item.variantData?.promotionalPrice,
                imageUrl: actualVariant?.imageUrl || item.variantData?.imageUrl,
                imageUrls: actualVariant?.imageUrls || item.variantData?.imageUrls
              },
              quantity: item.quantity,
              price: item.price,
              total: item.price * item.quantity
            };
          }),
          subtotal: cart.subtotal,
          itemCount: cart.itemCount,
          currency: cart.currency,
          isEmpty: cart.isEmpty
        }
      }
    });
    
  } catch (error) {
    console.error('Update cart item error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to update cart item',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    }, { status: 500 });
  }
}

// DELETE /api/cart/items/[itemId] - Remove item from cart
export async function DELETE(req, { params }) {
  try {
    await connectDB();
    
    const { itemId } = await params;
    
    // Get user authentication (optional - supports guest carts)
    const authResult = await optionalAuthWithSession(req);
    const user = authResult?.user;
    const sessionId = authResult?.sessionId;
    
    // Find user's cart
    let cart = null;
    
    if (user) {
      const userId = user.role === 'customer' ? null : user._id;
      const customerId = user.role === 'customer' ? user._id : user.customerId;
      cart = await Cart.findActiveCart(userId, customerId, null);
    } else if (sessionId) {
      cart = await Cart.findActiveCart(null, null, sessionId);
    }
    
    if (!cart) {
      return NextResponse.json({
        success: false,
        message: 'Cart not found'
      }, { status: 404 });
    }
    
    // Remove item from cart
    try {
      await cart.removeItem(itemId);
    } catch (error) {
      return NextResponse.json({
        success: false,
        message: 'Cart item not found'
      }, { status: 404 });
    }
    
    // Return updated cart
    await cart.populate([
      {
        path: 'items.product',
        select: 'name slug images status variants'
      }
    ]);
    
    return NextResponse.json({
      success: true,
      message: 'Item removed from cart successfully',
      data: {
        cart: {
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
        }
      }
    });
    
  } catch (error) {
    console.error('Remove cart item error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to remove cart item',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    }, { status: 500 });
  }
}

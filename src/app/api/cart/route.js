import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectDB from '../../../lib/database.js';
import Cart from '../../../models/Cart.js';
import Product from '../../../models/Product.js';
import { authenticateWithSession, optionalAuthWithSession } from '../../../lib/sessionAuth.js';

// GET /api/cart - Get user's cart
export async function GET(req) {
  try {
    await connectDB();
    
    // Get user authentication (optional - supports guest carts)
    const authResult = await optionalAuthWithSession(req);
    const user = authResult?.user;
    const sessionId = authResult?.sessionId;
    
    
    let cart = null;
    
    if (user) {
      // Authenticated user - look for user or customer cart
      const userId = user.role === 'customer' ? null : user._id;
      const customerId = user.role === 'customer' ? user._id : user.customerId;
      
      cart = await Cart.findActiveCart(userId, customerId, null);
      
      // If no authenticated cart found, look for guest cart to potentially migrate
      if (!cart && sessionId) {
        const guestCart = await Cart.findActiveCart(null, null, sessionId);
        if (guestCart && !guestCart.isEmpty) {
          // Migrate guest cart to authenticated user
          guestCart.userId = userId;
          guestCart.customerId = customerId;
          guestCart.type = user.role === 'customer' ? 'customer' : 'user';
          guestCart.sessionId = undefined;
          cart = await guestCart.save();
        }
      }
    } else if (sessionId) {
      // Guest user - look for session cart
      cart = await Cart.findActiveCart(null, null, sessionId);
    }
    
    // Create empty cart if none found
    if (!cart) {
      const userId = user?.role === 'customer' ? null : user?._id;
      const customerId = user?.role === 'customer' ? user._id : user?.customerId;
      const type = user ? (user.role === 'customer' ? 'customer' : 'user') : 'guest';
      
      cart = await Cart.createCart(userId, customerId, sessionId, type);
      console.log('🆕 Created new cart:', cart._id);
    }
    
    // Set session cookie if it's a guest session and not already set
    if (!user && sessionId) {
      const cookieStore = await cookies();
      const existingSessionId = cookieStore.get('sessionId')?.value;
      
      if (!existingSessionId || existingSessionId !== sessionId) {
        const response = NextResponse.json({
          success: true,
          message: 'Cart retrieved successfully',
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
                  promotionalPrice: item.variantData?.promotionalPrice
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
        
        // Set session cookie
        response.cookies.set('sessionId', sessionId, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 7 * 24 * 60 * 60 // 7 days
        });
        
        return response;
      }
    }
    
    // Populate product data for items with variants
    await cart.populate([
      {
        path: 'items.product',
        select: 'name slug images status variants'
      }
    ]);
    
    return NextResponse.json({
      success: true,
      message: 'Cart retrieved successfully',
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
    console.error('Get cart error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to retrieve cart',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    }, { status: 500 });
  }
}

// POST /api/cart - Add item to cart
export async function POST(req) {
  try {
    await connectDB();
    
    const body = await req.json();
    const { productId, variantId, quantity = 1 } = body;
    
    // Validate required fields
    if (!productId || !variantId) {
      return NextResponse.json({
        success: false,
        message: 'Product ID and Variant ID are required'
      }, { status: 400 });
    }
    
    if (quantity < 1) {
      return NextResponse.json({
        success: false,
        message: 'Quantity must be at least 1'
      }, { status: 400 });
    }
    
    // Get user authentication (optional - supports guest carts)
    const authResult = await optionalAuthWithSession(req);
    const user = authResult?.user;
    const sessionId = authResult?.sessionId;
    
    
    // Verify product and variant exist
    const product = await Product.findById(productId);
    if (!product || product.status !== 'active') {
      return NextResponse.json({
        success: false,
        message: 'Product not found or inactive'
      }, { status: 404 });
    }
    
    const variant = product.variants.find(v => v._id.toString() === variantId);
    if (!variant || !variant.isActive) {
      return NextResponse.json({
        success: false,
        message: 'Product variant not found or inactive'
      }, { status: 404 });
    }
    
    // Check stock availability - DISABLED until inventory module is implemented
    // if (variant.stock < quantity) {
    //   return NextResponse.json({
    //     success: false,
    //     message: `Only ${variant.stock} items available in stock`
    //   }, { status: 400 });
    // }
    
    // Find or create cart
    let cart = null;
    
    if (user) {
      const userId = user.role === 'customer' ? null : user._id;
      const customerId = user.role === 'customer' ? user._id : user.customerId;
      
      cart = await Cart.findActiveCart(userId, customerId, null);
      
      if (!cart) {
        const type = user.role === 'customer' ? 'customer' : 'user';
        cart = await Cart.createCart(userId, customerId, null, type);
      }
    } else if (sessionId) {
      cart = await Cart.findActiveCart(null, null, sessionId);
      
      if (!cart) {
        cart = await Cart.createCart(null, null, sessionId, 'guest');
      }
    } else {
      return NextResponse.json({
        success: false,
        message: 'Session required for cart operations'
      }, { status: 401 });
    }
    
    // Prepare cached data
    const productData = {
      name: product.name,
      slug: product.slug,
      image: product.images?.[0]?.url
    };
    
    const variantData = {
      size: variant.size,
      sku: variant.sku,
      price: variant.price,
      promotionalPrice: variant.promotionalPrice,
      imageUrl: variant.imageUrl,
      imageUrls: variant.imageUrls
    };
    
    // Add item to cart
    await cart.addItem(productId, variantId, quantity, productData, variantData);
    
    // Return updated cart
    await cart.populate([
      {
        path: 'items.product',
        select: 'name slug images status variants'
      }
    ]);
    
    const response = NextResponse.json({
      success: true,
      message: 'Item added to cart successfully',
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
    
    // Set session cookie if it's a guest session and not already set
    if (!user && sessionId) {
      const cookieStore = await cookies();
      const existingSessionId = cookieStore.get('sessionId')?.value;
      
      if (!existingSessionId || existingSessionId !== sessionId) {
        response.cookies.set('sessionId', sessionId, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 7 * 24 * 60 * 60 // 7 days
        });
      }
    }
    
    return response;
    
  } catch (error) {
    console.error('Add to cart error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to add item to cart',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    }, { status: 500 });
  }
}

// DELETE /api/cart - Clear entire cart
export async function DELETE(req) {
  try {
    await connectDB();
    
    // Get user authentication (optional - supports guest carts)
    const authResult = await optionalAuthWithSession(req);
    const user = authResult?.user;
    const sessionId = authResult?.sessionId;
    
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
    
    await cart.clear();
    
    return NextResponse.json({
      success: true,
      message: 'Cart cleared successfully',
      data: {
        cart: {
          id: cart._id,
          items: [],
          subtotal: 0,
          itemCount: 0,
          currency: cart.currency,
          isEmpty: true
        }
      }
    });
    
  } catch (error) {
    console.error('Clear cart error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to clear cart',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    }, { status: 500 });
  }
}

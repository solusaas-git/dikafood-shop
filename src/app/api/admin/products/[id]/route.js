import { NextResponse } from 'next/server';
import connectDB from '../../../../../lib/database.js';
import Product from '../../../../../models/Product.js';
import Brand from '../../../../../models/Brand.js';
import Category from '../../../../../models/Category.js';
import { authenticate } from '../../../../../lib/auth.js';

// GET /api/admin/products/[id] - Get single product
export async function GET(request, { params }) {
  try {
    const user = await authenticate(request);
    
    // Check admin permissions
    if (!['admin', 'manager'].includes(user.role)) {
      return NextResponse.json(
        { success: false, message: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    await connectDB();

    const { id } = await params;
    const product = await Product.findById(id)
      .populate('brand', 'name slug logo website')
      .populate('category', 'name slug')
      .populate('relatedProducts', 'name slug variants.price images')
      .lean();

    if (!product) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { product }
    });

  } catch (error) {
    console.error('Get product error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/products/[id] - Update product
export async function PUT(request, { params }) {
  try {
    const user = await authenticate(request);
    
    // Check admin permissions
    if (!['admin', 'manager'].includes(user.role)) {
      return NextResponse.json(
        { success: false, message: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    await connectDB();

    const body = await request.json();
    
    // Find existing product
    const { id } = await params;
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }

    // Validate brand and category if provided
    if (body.brand && body.brand !== existingProduct.brand.toString()) {
      const brandExists = await Brand.findById(body.brand);
      if (!brandExists) {
        return NextResponse.json(
          { success: false, message: 'Brand not found' },
          { status: 400 }
        );
      }
      body.brandDisplayName = brandExists.name;
    }

    if (body.category && body.category !== existingProduct.category.toString()) {
      const categoryExists = await Category.findById(body.category);
      if (!categoryExists) {
        return NextResponse.json(
          { success: false, message: 'Category not found' },
          { status: 400 }
        );
      }
      body.categoryName = categoryExists.name;
    }

    // Handle slug update if name changed
    if (body.name && body.name !== existingProduct.name) {
      let slug = body.name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim('-');

      // Check if slug exists (excluding current product)
      let slugCounter = 1;
      let originalSlug = slug;
      while (await Product.findOne({ slug, _id: { $ne: id } })) {
        slug = `${originalSlug}-${slugCounter}`;
        slugCounter++;
      }
      body.slug = slug;
    }

    // Clean up promotional prices in variants
    if (body.variants && Array.isArray(body.variants)) {
      body.variants = body.variants.map(variant => {
        // If promotional price is undefined, null, empty string, or 0, remove it
        if (!variant.promotionalPrice || variant.promotionalPrice === 0 || variant.promotionalPrice === '') {
          const { promotionalPrice, ...cleanVariant } = variant;
          return cleanVariant;
        }
        return variant;
      });
    }

    // Update product
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        ...body,
        updatedBy: user._id
      },
      { 
        new: true, 
        runValidators: true 
      }
    ).populate([
      { path: 'brand', select: 'name slug logo' },
      { path: 'category', select: 'name slug' }
    ]);

    // Update brand and category product counts if they changed
    if (body.brand && body.brand !== existingProduct.brand.toString()) {
      const [oldBrand, newBrand] = await Promise.all([
        Brand.findById(existingProduct.brand),
        Brand.findById(body.brand)
      ]);
      
      await Promise.all([
        oldBrand?.updateProductCount(),
        newBrand?.updateProductCount()
      ]);
    }

    if (body.category && body.category !== existingProduct.category.toString()) {
      const [oldCategory, newCategory] = await Promise.all([
        Category.findById(existingProduct.category),
        Category.findById(body.category)
      ]);
      
      await Promise.all([
        oldCategory?.updateProductCount(),
        newCategory?.updateProductCount()
      ]);
    }

    return NextResponse.json({
      success: true,
      data: { product: updatedProduct },
      message: 'Product updated successfully'
    });

  } catch (error) {
    console.error('Update product error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { success: false, message: 'Validation error', errors },
        { status: 400 }
      );
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return NextResponse.json(
        { success: false, message: `${field} already exists` },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update product' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/products/[id] - Delete product
export async function DELETE(request, { params }) {
  try {
    const user = await authenticate(request);
    
    // Check admin permissions (only admin can delete)
    if (user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Only administrators can delete products' },
        { status: 403 }
      );
    }

    await connectDB();

    const { id } = await params;
    // Find the product to get brand and category info before deletion
    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }

    // Soft delete by setting status to 'discontinued'
    const { searchParams } = new URL(request.url);
    const hardDelete = searchParams.get('hard') === 'true';

    if (hardDelete) {
      // Hard delete - completely remove from database
      await Product.findByIdAndDelete(id);
    } else {
      // Soft delete - set status to discontinued
      await Product.findByIdAndUpdate(id, {
        status: 'discontinued',
        updatedBy: user._id
      });
    }

    // Update brand and category product counts
    const [brand, category] = await Promise.all([
      Brand.findById(product.brand),
      Category.findById(product.category)
    ]);

    await Promise.all([
      brand?.updateProductCount(),
      category?.updateProductCount()
    ]);

    return NextResponse.json({
      success: true,
      message: hardDelete ? 'Product deleted permanently' : 'Product discontinued successfully'
    });

  } catch (error) {
    console.error('Delete product error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to delete product' },
      { status: 500 }
    );
  }
}

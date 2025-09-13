import { NextResponse } from 'next/server';
import connectDB from '../../../../../lib/database.js';
import Category from '../../../../../models/Category.js';
import Product from '../../../../../models/Product.js';
import { authenticate } from '../../../../../lib/auth.js';

// GET /api/admin/categories/[id] - Get single category
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
    const category = await Category.findById(id)
      .populate('parent', 'name slug')
      .populate('featuredProducts', 'name slug variants.price images')
      .lean();

    if (!category) {
      return NextResponse.json(
        { success: false, message: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { category }
    });

  } catch (error) {
    console.error('Get category error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch category' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/categories/[id] - Update category
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
    
    // Find existing category
    const { id } = await params;
    const existingCategory = await Category.findById(id);
    if (!existingCategory) {
      return NextResponse.json(
        { success: false, message: 'Category not found' },
        { status: 404 }
      );
    }

    // Validate parent category if provided
    if (body.parent && body.parent !== existingCategory.parent?.toString()) {
      // Check if parent exists
      const parentExists = await Category.findById(body.parent);
      if (!parentExists) {
        return NextResponse.json(
          { success: false, message: 'Parent category not found' },
          { status: 400 }
        );
      }

      // Check for circular reference
      if (body.parent === id) {
        return NextResponse.json(
          { success: false, message: 'Category cannot be its own parent' },
          { status: 400 }
        );
      }

      // Check if trying to set a descendant as parent
      const descendants = await existingCategory.getDescendants();
      const descendantIds = descendants.map(d => d._id.toString());
      if (descendantIds.includes(body.parent)) {
        return NextResponse.json(
          { success: false, message: 'Cannot set a descendant category as parent' },
          { status: 400 }
        );
      }
    }

    // Handle slug update if name changed
    if (body.name && body.name !== existingCategory.name) {
      let slug = body.name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim('-');

      // Check if slug exists (excluding current category)
      let slugCounter = 1;
      let originalSlug = slug;
      while (await Category.findOne({ slug, _id: { $ne: id } })) {
        slug = `${originalSlug}-${slugCounter}`;
        slugCounter++;
      }
      body.slug = slug;
    }

    // Update category
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      {
        ...body,
        updatedBy: user._id
      },
      { 
        new: true, 
        runValidators: true 
      }
    ).populate('parent', 'name slug');

    return NextResponse.json({
      success: true,
      data: { category: updatedCategory },
      message: 'Category updated successfully'
    });

  } catch (error) {
    console.error('Update category error:', error);
    
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
      { success: false, message: error.message || 'Failed to update category' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/categories/[id] - Delete category
export async function DELETE(request, { params }) {
  try {
    const user = await authenticate(request);
    
    // Check admin permissions (only admin can delete)
    if (user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Only administrators can delete categories' },
        { status: 403 }
      );
    }

    await connectDB();

    // Find the category
    const { id } = await params;
    const category = await Category.findById(id);
    if (!category) {
      return NextResponse.json(
        { success: false, message: 'Category not found' },
        { status: 404 }
      );
    }

    // Check if category has products
    const productCount = await Product.countDocuments({ category: id });
    if (productCount > 0) {
      return NextResponse.json(
        { success: false, message: `Cannot delete category with ${productCount} products. Move or delete products first.` },
        { status: 400 }
      );
    }

    // Check if category has children
    const childrenCount = await Category.countDocuments({ parent: id });
    if (childrenCount > 0) {
      return NextResponse.json(
        { success: false, message: `Cannot delete category with ${childrenCount} subcategories. Delete or reassign subcategories first.` },
        { status: 400 }
      );
    }

    // Delete the category
    await Category.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully'
    });

  } catch (error) {
    console.error('Delete category error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to delete category' },
      { status: 500 }
    );
  }
}

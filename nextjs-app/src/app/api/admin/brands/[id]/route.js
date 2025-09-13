import { NextResponse } from 'next/server';
import connectDB from '../../../../../lib/database.js';
import Brand from '../../../../../models/Brand.js';
import Product from '../../../../../models/Product.js';
import { authenticate } from '../../../../../lib/auth.js';

// GET /api/admin/brands/[id] - Get single brand
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
    const brand = await Brand.findById(id).lean();

    if (!brand) {
      return NextResponse.json(
        { success: false, message: 'Brand not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { brand }
    });

  } catch (error) {
    console.error('Get brand error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch brand' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/brands/[id] - Update brand
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
    
    // Find existing brand
    const { id } = await params;
    const existingBrand = await Brand.findById(id);
    if (!existingBrand) {
      return NextResponse.json(
        { success: false, message: 'Brand not found' },
        { status: 404 }
      );
    }

    // Handle slug update if name changed
    if (body.name && body.name !== existingBrand.name) {
      let slug = body.name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim('-');

      // Check if slug exists (excluding current brand)
      let slugCounter = 1;
      let originalSlug = slug;
      while (await Brand.findOne({ slug, _id: { $ne: id } })) {
        slug = `${originalSlug}-${slugCounter}`;
        slugCounter++;
      }
      body.slug = slug;
    }

    // Update brand
    const updatedBrand = await Brand.findByIdAndUpdate(
      id,
      {
        ...body,
        updatedBy: user._id
      },
      { 
        new: true, 
        runValidators: true 
      }
    );

    return NextResponse.json({
      success: true,
      data: { brand: updatedBrand },
      message: 'Brand updated successfully'
    });

  } catch (error) {
    console.error('Update brand error:', error);
    
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
      { success: false, message: error.message || 'Failed to update brand' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/brands/[id] - Delete brand
export async function DELETE(request, { params }) {
  try {
    const user = await authenticate(request);
    
    // Check admin permissions (only admin can delete)
    if (user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Only administrators can delete brands' },
        { status: 403 }
      );
    }

    await connectDB();

    // Find the brand
    const { id } = await params;
    const brand = await Brand.findById(id);
    if (!brand) {
      return NextResponse.json(
        { success: false, message: 'Brand not found' },
        { status: 404 }
      );
    }

    // Check if brand has products
    const productCount = await Product.countDocuments({ brand: id });
    if (productCount > 0) {
      return NextResponse.json(
        { success: false, message: `Cannot delete brand with ${productCount} products. Move or delete products first.` },
        { status: 400 }
      );
    }

    // Delete the brand
    await Brand.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: 'Brand deleted successfully'
    });

  } catch (error) {
    console.error('Delete brand error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to delete brand' },
      { status: 500 }
    );
  }
}

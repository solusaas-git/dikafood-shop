import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/database.js';
import Category from '../../../../models/Category.js';
import { authenticate } from '../../../../lib/auth.js';

// GET /api/admin/categories - Get all categories
export async function GET(request) {
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

    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format'); // 'tree', 'flat', or default
    const includeInactive = searchParams.get('includeInactive') === 'true';

    let query = {};
    if (!includeInactive) {
      query.isActive = true;
    }

    if (format === 'tree') {
      // Return hierarchical tree structure
      const categories = await Category.getTree();
      return NextResponse.json({
        success: true,
        data: { categories }
      });
    }

    // Return flat list
    const categories = await Category.find(query)
      .populate('parent', 'name slug')
      .sort({ level: 1, sortOrder: 1, name: 1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: { categories }
    });

  } catch (error) {
    console.error('Get categories error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

// POST /api/admin/categories - Create new category
export async function POST(request) {
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
    
    // Validate required fields
    if (!body.name) {
      return NextResponse.json(
        { success: false, message: 'Name is required' },
        { status: 400 }
      );
    }

    // Validate parent category exists if provided
    if (body.parent) {
      const parentExists = await Category.findById(body.parent);
      if (!parentExists) {
        return NextResponse.json(
          { success: false, message: 'Parent category not found' },
          { status: 400 }
        );
      }

      // Check for circular reference
      if (body.parent === body._id) {
        return NextResponse.json(
          { success: false, message: 'Category cannot be its own parent' },
          { status: 400 }
        );
      }
    }

    // Generate unique slug
    let slug = body.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');

    // Check if slug exists and make it unique
    let slugCounter = 1;
    let originalSlug = slug;
    while (await Category.findOne({ slug })) {
      slug = `${originalSlug}-${slugCounter}`;
      slugCounter++;
    }

    // Create category
    const categoryData = {
      ...body,
      slug,
      createdBy: user._id,
      updatedBy: user._id
    };

    const category = new Category(categoryData);
    await category.save();

    // Populate the response
    await category.populate('parent', 'name slug');

    return NextResponse.json({
      success: true,
      data: { category },
      message: 'Category created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Create category error:', error);
    
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
      { success: false, message: error.message || 'Failed to create category' },
      { status: 500 }
    );
  }
}

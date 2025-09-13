import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/database.js';
import Product from '../../../../models/Product.js';
import Brand from '../../../../models/Brand.js';
import Category from '../../../../models/Category.js';
import { authenticate } from '../../../../lib/auth.js';

// GET /api/admin/products - Get all products with pagination and filters
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
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category');
    const brand = searchParams.get('brand');
    const status = searchParams.get('status');
    const featured = searchParams.get('featured');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Build query
    const query = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { brandDisplayName: { $regex: search, $options: 'i' } },
        { categoryName: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    if (category) query.category = category;
    if (brand) query.brand = brand;
    if (status) query.status = status;
    if (featured !== null && featured !== undefined) {
      query.featured = featured === 'true';
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination
    const skip = (page - 1) * limit;
    
    const [products, total] = await Promise.all([
      Product.find(query)
        .populate('brand', 'name slug logo')
        .populate('category', 'name slug')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(query)
    ]);

    // Calculate derived fields for each product
    const productsWithCalculatedFields = products.map(product => {
      // Calculate total stock from all variants
      const totalStock = product.variants?.reduce((sum, variant) => {
        return sum + (variant.stock || 0);
      }, 0) || 0;

      // Calculate price range from variants
      const prices = product.variants?.map(v => v.price).filter(price => price && price > 0) || [];
      const promotionalPrices = product.variants?.map(v => v.promotionalPrice).filter(price => price && price > 0) || [];
      
      // Use promotional prices if available, otherwise use regular prices
      const allPrices = promotionalPrices.length > 0 ? promotionalPrices : prices;
      
      const minPrice = allPrices.length > 0 ? Math.min(...allPrices) : 0;
      const maxPrice = allPrices.length > 0 ? Math.max(...allPrices) : 0;

      return {
        ...product,
        totalStock,
        minPrice,
        maxPrice
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        products: productsWithCalculatedFields,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get products error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST /api/admin/products - Create new product
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
    const requiredFields = ['name', 'description', 'brand', 'category', 'variants'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, message: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Validate variants
    if (!Array.isArray(body.variants) || body.variants.length === 0) {
      return NextResponse.json(
        { success: false, message: 'At least one variant is required' },
        { status: 400 }
      );
    }

    // Validate brand and category exist
    const [brandExists, categoryExists] = await Promise.all([
      Brand.findById(body.brand),
      Category.findById(body.category)
    ]);

    if (!brandExists) {
      return NextResponse.json(
        { success: false, message: 'Brand not found' },
        { status: 400 }
      );
    }

    if (!categoryExists) {
      return NextResponse.json(
        { success: false, message: 'Category not found' },
        { status: 400 }
      );
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
    while (await Product.findOne({ slug })) {
      slug = `${originalSlug}-${slugCounter}`;
      slugCounter++;
    }

    // Create product
    const productData = {
      ...body,
      slug,
      createdBy: user._id,
      updatedBy: user._id,
      brandDisplayName: brandExists.name,
      categoryName: categoryExists.name
    };

    const product = new Product(productData);
    await product.save();

    // Update brand and category product counts
    await Promise.all([
      brandExists.updateProductCount(),
      categoryExists.updateProductCount()
    ]);

    // Populate the response
    await product.populate([
      { path: 'brand', select: 'name slug logo' },
      { path: 'category', select: 'name slug' }
    ]);

    return NextResponse.json({
      success: true,
      data: { product },
      message: 'Product created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Create product error:', error);
    
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
      { success: false, message: error.message || 'Failed to create product' },
      { status: 500 }
    );
  }
}

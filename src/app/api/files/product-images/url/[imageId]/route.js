import { NextResponse } from 'next/server';
import path from 'path';
import { existsSync } from 'fs';

export async function GET(req, { params }) {
  try {
    const { imageId } = await params;
    
    if (!imageId) {
      return NextResponse.json({
        success: false,
        message: 'Image ID is required'
      }, { status: 400 });
    }

    // Clean the image ID (remove any path prefixes)
    const cleanImageId = imageId.replace(/^\/+/, '');
    
    // Define possible image locations
    const possiblePaths = [
      `/uploads/products/${cleanImageId}`,
      `/images/products/${cleanImageId}`,
      `/public/uploads/products/${cleanImageId}`,
      `/public/images/products/${cleanImageId}`
    ];

    // Check if file exists in any of the possible locations
    let imageUrl = null;
    for (const imagePath of possiblePaths) {
      const fullPath = path.join(process.cwd(), 'public', imagePath.replace('/public', ''));
      if (existsSync(fullPath)) {
        imageUrl = imagePath.replace('/public', '');
        break;
      }
    }

    // If no file found, return a default product image as placeholder
    if (!imageUrl) {
      imageUrl = '/images/products/dika-500ML.webp'; // Use an existing product image as placeholder
    }

    return NextResponse.json({
      success: true,
      url: imageUrl,
      imageId: cleanImageId
    });

  } catch (error) {
    console.error('Get product image URL error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to get image URL',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    }, { status: 500 });
  }
}

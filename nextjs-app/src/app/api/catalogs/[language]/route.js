import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

/**
 * GET /api/catalogs/[language] - Download catalog in specified language
 * @param {Request} req - The request object
 * @param {Object} params - Route parameters containing language
 * @returns {Response} - File download response or error
 */
export async function GET(req, { params }) {
  try {
    const { language } = await params;
    
    // Validate language parameter
    const validLanguages = ['fr', 'ar'];
    if (!validLanguages.includes(language)) {
      return NextResponse.json({
        success: false,
        message: 'Invalid language. Supported languages: fr, ar'
      }, { status: 400 });
    }

    // Define catalog file path based on language
    const catalogFileName = language === 'fr' ? 'catalogue-dikafood.pdf' : 'catalogue-dikafood-ar.pdf';
    const catalogPath = path.join(process.cwd(), 'public', 'catalogues', catalogFileName);
    
    // Check if catalog file exists
    if (!fs.existsSync(catalogPath)) {
      // If Arabic catalog doesn't exist, fallback to French catalog
      if (language === 'ar') {
        const fallbackPath = path.join(process.cwd(), 'public', 'catalogues', 'catalogue-dikafood.pdf');
        if (fs.existsSync(fallbackPath)) {
          const fileBuffer = fs.readFileSync(fallbackPath);
          
          return new NextResponse(fileBuffer, {
            status: 200,
            headers: {
              'Content-Type': 'application/pdf',
              'Content-Disposition': `attachment; filename="catalogue-dikafood-${language}.pdf"`,
              'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
            }
          });
        }
      }
      
      return NextResponse.json({
        success: false,
        message: 'Catalog file not found'
      }, { status: 404 });
    }

    // Read the catalog file
    const fileBuffer = fs.readFileSync(catalogPath);
    
    // Return the file as a download
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${catalogFileName}"`,
        'Content-Length': fileBuffer.length.toString(),
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      }
    });

  } catch (error) {
    console.error('Catalog download error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to download catalog'
    }, { status: 500 });
  }
}

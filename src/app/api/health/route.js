import { NextResponse } from 'next/server';
import connectDB from '../../../lib/database.js';

export async function GET() {
  try {
    // Test basic API functionality
    const response = {
      success: true,
      message: 'API is working!',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'unknown',
      database: 'not tested'
    };

    // Test database connection
    try {
      await connectDB();
      response.database = 'connected';
    } catch (dbError) {
      response.database = `error: ${dbError.message}`;
      response.dbError = true;
    }

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}
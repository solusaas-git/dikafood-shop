import { NextResponse } from 'next/server';
import connectDB from '../../../lib/database.js';

export async function GET() {
  try {
    // Test database connection
    await connectDB();
    
    return NextResponse.json({
      success: true,
      message: 'DikaFood API is running',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      database: 'Connected'
    });
  } catch (error) {
    console.error('Health check failed:', error);
    
    return NextResponse.json({
      success: false,
      message: 'API health check failed',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      database: 'Disconnected',
      error: error.message
    }, { status: 500 });
  }
}

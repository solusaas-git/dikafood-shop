import { NextResponse } from 'next/server';

export async function GET(request) {
  // Only allow this in development or with a special debug key
  const debugKey = process.env.DEBUG_KEY;
  const requestDebugKey = new URL(request.url).searchParams.get('key');
  
  if (process.env.NODE_ENV === 'production' && (!debugKey || requestDebugKey !== debugKey)) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
  }

  try {
    const envCheck = {
      NODE_ENV: process.env.NODE_ENV || 'not set',
      MONGODB_URI: process.env.MONGODB_URI ? 'set' : 'not set',
      JWT_SECRET: process.env.JWT_SECRET ? 'set' : 'not set',
      JWT_ACCESS_TOKEN_EXPIRATION: process.env.JWT_ACCESS_TOKEN_EXPIRATION || 'not set',
      JWT_REFRESH_TOKEN_EXPIRATION: process.env.JWT_REFRESH_TOKEN_EXPIRATION || 'not set',
      EMAIL_SERVICE_PROVIDER: process.env.EMAIL_SERVICE_PROVIDER || 'not set',
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'not set',
      // Add other important env vars here
      timestamp: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      environment: envCheck
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

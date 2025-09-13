import { NextResponse } from 'next/server';
import connectDB from '../../../lib/database.js';
import PaymentMethod from '../../../models/PaymentMethod.js';

export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const active = searchParams.get('active');
    
    let query = {};
    if (active === 'true') {
      query.isActive = true;
    }
    
    const paymentMethods = await PaymentMethod.find(query)
      .select('name description type logo isActive sortOrder')
      .sort({ sortOrder: 1, name: 1 });
    
    return NextResponse.json({
      success: true,
      data: paymentMethods
    });
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch payment methods' },
      { status: 500 }
    );
  }
}

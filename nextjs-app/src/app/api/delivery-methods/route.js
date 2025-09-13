import { NextResponse } from 'next/server';
import connectDB from '../../../lib/database.js';
import DeliveryMethod from '../../../models/DeliveryMethod.js';

export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const active = searchParams.get('active');
    const city = searchParams.get('city');
    
    let query = {};
    if (active === 'true') {
      query.isActive = true;
    }
    
    // If city is provided, filter by available cities
    if (city) {
      // First, find the city ID
      const City = require('../../../models/City.js').default;
      const cityDoc = await City.findOne({ name: city }).select('_id');
      
      if (cityDoc) {
        query.availableCities = cityDoc._id;
      } else {
        // If city not found, return empty array
        return NextResponse.json({
          success: true,
          data: []
        });
      }
    }
    
    const deliveryMethods = await DeliveryMethod.find(query)
      .select('name description type logo price estimatedTime isActive sortOrder shops')
      .sort({ sortOrder: 1, name: 1 });
    
    return NextResponse.json({
      success: true,
      data: deliveryMethods
    });
  } catch (error) {
    console.error('Error fetching delivery methods:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch delivery methods' },
      { status: 500 }
    );
  }
}
import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/database';
import City from '../../../models/City';

export async function GET(req) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(req.url);
    const deliveryOnly = searchParams.get('deliveryOnly') === 'true';
    const region = searchParams.get('region');
    const country = searchParams.get('country');

    // Build query for active cities
    const query = { isActive: true };
    
    if (deliveryOnly) {
      query.deliveryAvailable = true;
    }
    
    if (region) {
      query.region = { $regex: region, $options: 'i' };
    }
    
    if (country) {
      query.country = country;
    }

    // Get cities sorted by sortOrder and name
    const cities = await City.find(query)
      .select('name nameArabic region country postalCode deliveryFee deliveryAvailable sortOrder')
      .sort({ sortOrder: 1, name: 1 })
      .lean();

    // Group cities by region for better organization
    const citiesByRegion = cities.reduce((acc, city) => {
      const region = city.region;
      if (!acc[region]) {
        acc[region] = [];
      }
      acc[region].push({
        _id: city._id,
        name: city.name,
        nameArabic: city.nameArabic,
        displayName: city.nameArabic ? `${city.name} - ${city.nameArabic}` : city.name,
        postalCode: city.postalCode,
        deliveryFee: city.deliveryFee,
        deliveryAvailable: city.deliveryAvailable
      });
      return acc;
    }, {});

    return NextResponse.json({
      success: true,
      data: {
        cities,
        citiesByRegion
      }
    });

  } catch (error) {
    console.error('Get public cities error:', error);
    return NextResponse.json({
      success: false,
      message: 'Erreur lors de la récupération des villes'
    }, { status: 500 });
  }
}

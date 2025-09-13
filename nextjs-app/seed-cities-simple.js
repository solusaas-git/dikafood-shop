// Simple script to add cities via API calls
const cities = [
  // Major Moroccan cities
  { name: 'Casablanca', nameArabic: 'الدار البيضاء', region: 'Casablanca-Settat', postalCode: '20000', deliveryFee: 30, sortOrder: 1 },
  { name: 'Rabat', nameArabic: 'الرباط', region: 'Rabat-Salé-Kénitra', postalCode: '10000', deliveryFee: 35, sortOrder: 2 },
  { name: 'Fès', nameArabic: 'فاس', region: 'Fès-Meknès', postalCode: '30000', deliveryFee: 40, sortOrder: 3 },
  { name: 'Marrakech', nameArabic: 'مراكش', region: 'Marrakech-Safi', postalCode: '40000', deliveryFee: 40, sortOrder: 4 },
  { name: 'Salé', nameArabic: 'سلا', region: 'Rabat-Salé-Kénitra', postalCode: '11000', deliveryFee: 35, sortOrder: 5 },
  { name: 'Tanger', nameArabic: 'طنجة', region: 'Tanger-Tétouan-Al Hoceïma', postalCode: '90000', deliveryFee: 45, sortOrder: 6 },
  { name: 'Meknès', nameArabic: 'مكناس', region: 'Fès-Meknès', postalCode: '50000', deliveryFee: 40, sortOrder: 7 },
  { name: 'Oujda', nameArabic: 'وجدة', region: 'Oriental', postalCode: '60000', deliveryFee: 50, sortOrder: 8 },
  { name: 'Kénitra', nameArabic: 'القنيطرة', region: 'Rabat-Salé-Kénitra', postalCode: '14000', deliveryFee: 35, sortOrder: 9 },
  { name: 'Agadir', nameArabic: 'أكادير', region: 'Souss-Massa', postalCode: '80000', deliveryFee: 45, sortOrder: 10 },
  { name: 'Tétouan', nameArabic: 'تطوان', region: 'Tanger-Tétouan-Al Hoceïma', postalCode: '93000', deliveryFee: 45, sortOrder: 11 },
  { name: 'Safi', nameArabic: 'آسفي', region: 'Marrakech-Safi', postalCode: '46000', deliveryFee: 40, sortOrder: 12 },
  { name: 'Mohammedia', nameArabic: 'المحمدية', region: 'Casablanca-Settat', postalCode: '20650', deliveryFee: 30, sortOrder: 13 },
  { name: 'El Jadida', nameArabic: 'الجديدة', region: 'Casablanca-Settat', postalCode: '24000', deliveryFee: 35, sortOrder: 14 },
  { name: 'Settat', nameArabic: 'سطات', region: 'Casablanca-Settat', postalCode: '26000', deliveryFee: 35, sortOrder: 15 }
];

async function seedCitiesViaAPI() {
  try {
    console.log('🌟 Starting to seed cities via API...');
    
    // Get admin token (you'll need to replace this with actual admin token)
    const adminToken = 'YOUR_ACCESS_TOKEN'; // Replace with actual token
    
    if (adminToken === 'YOUR_ACCESS_TOKEN') {
      console.log('⚠️  Please get an admin token first:');
      console.log('1. Login to admin panel');
      console.log('2. Copy the token from localStorage.getItem("accessToken")');
      console.log('3. Replace YOUR_ACCESS_TOKEN in this script');
      return;
    }
    
    const baseUrl = 'http://localhost:3000'; // Adjust if needed
    let successCount = 0;
    let errorCount = 0;

    for (const cityData of cities) {
      try {
        const response = await fetch(`${baseUrl}/api/admin/cities`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${adminToken}`
          },
          body: JSON.stringify({
            ...cityData,
            deliveryAvailable: true,
            isActive: true
          })
        });

        const result = await response.json();
        
        if (result.success) {
          console.log(`✅ ${cityData.name} (${cityData.nameArabic}) - ${cityData.region}`);
          successCount++;
        } else {
          console.log(`❌ Failed to create ${cityData.name}: ${result.message}`);
          errorCount++;
        }
      } catch (error) {
        console.log(`❌ Error creating ${cityData.name}:`, error.message);
        errorCount++;
      }
    }

    console.log(`\n🎉 Seeding complete!`);
    console.log(`✅ Successfully created: ${successCount} cities`);
    console.log(`❌ Failed: ${errorCount} cities`);

  } catch (error) {
    console.error('❌ Error seeding cities:', error);
  }
}

// Run the seeding
seedCitiesViaAPI();

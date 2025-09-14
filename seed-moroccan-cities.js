import mongoose from 'mongoose';
import City from './src/models/City.js';
import User from './src/models/User.js';
import connectDB from './src/lib/database.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Comprehensive list of Moroccan cities organized by region
const moroccanCities = [
  // Casablanca-Settat Region
  { name: 'Casablanca', nameArabic: 'الدار البيضاء', region: 'Casablanca-Settat', postalCode: '20000', deliveryFee: 30, sortOrder: 1 },
  { name: 'Settat', nameArabic: 'سطات', region: 'Casablanca-Settat', postalCode: '26000', deliveryFee: 35, sortOrder: 2 },
  { name: 'Mohammedia', nameArabic: 'المحمدية', region: 'Casablanca-Settat', postalCode: '20650', deliveryFee: 30, sortOrder: 3 },
  { name: 'El Jadida', nameArabic: 'الجديدة', region: 'Casablanca-Settat', postalCode: '24000', deliveryFee: 35, sortOrder: 4 },
  { name: 'Berrechid', nameArabic: 'برشيد', region: 'Casablanca-Settat', postalCode: '26100', deliveryFee: 35, sortOrder: 5 },
  { name: 'Azemmour', nameArabic: 'أزمور', region: 'Casablanca-Settat', postalCode: '24100', deliveryFee: 35, sortOrder: 6 },
  { name: 'Sidi Bennour', nameArabic: 'سيدي بنور', region: 'Casablanca-Settat', postalCode: '24200', deliveryFee: 40, sortOrder: 7 },
  { name: 'Ben Ahmed', nameArabic: 'بن أحمد', region: 'Casablanca-Settat', postalCode: '26300', deliveryFee: 40, sortOrder: 8 },

  // Rabat-Salé-Kénitra Region
  { name: 'Rabat', nameArabic: 'الرباط', region: 'Rabat-Salé-Kénitra', postalCode: '10000', deliveryFee: 35, sortOrder: 9 },
  { name: 'Salé', nameArabic: 'سلا', region: 'Rabat-Salé-Kénitra', postalCode: '11000', deliveryFee: 35, sortOrder: 10 },
  { name: 'Kénitra', nameArabic: 'القنيطرة', region: 'Rabat-Salé-Kénitra', postalCode: '14000', deliveryFee: 35, sortOrder: 11 },
  { name: 'Témara', nameArabic: 'تمارة', region: 'Rabat-Salé-Kénitra', postalCode: '12000', deliveryFee: 35, sortOrder: 12 },
  { name: 'Skhirat', nameArabic: 'الصخيرات', region: 'Rabat-Salé-Kénitra', postalCode: '12020', deliveryFee: 35, sortOrder: 13 },
  { name: 'Khémisset', nameArabic: 'الخميسات', region: 'Rabat-Salé-Kénitra', postalCode: '15000', deliveryFee: 40, sortOrder: 14 },
  { name: 'Sidi Kacem', nameArabic: 'سيدي قاسم', region: 'Rabat-Salé-Kénitra', postalCode: '14200', deliveryFee: 40, sortOrder: 15 },
  { name: 'Sidi Slimane', nameArabic: 'سيدي سليمان', region: 'Rabat-Salé-Kénitra', postalCode: '14400', deliveryFee: 40, sortOrder: 16 },

  // Fès-Meknès Region
  { name: 'Fès', nameArabic: 'فاس', region: 'Fès-Meknès', postalCode: '30000', deliveryFee: 40, sortOrder: 17 },
  { name: 'Meknès', nameArabic: 'مكناس', region: 'Fès-Meknès', postalCode: '50000', deliveryFee: 40, sortOrder: 18 },
  { name: 'Taza', nameArabic: 'تازة', region: 'Fès-Meknès', postalCode: '35000', deliveryFee: 45, sortOrder: 19 },
  { name: 'Sefrou', nameArabic: 'صفرو', region: 'Fès-Meknès', postalCode: '31000', deliveryFee: 45, sortOrder: 20 },
  { name: 'El Hajeb', nameArabic: 'الحاجب', region: 'Fès-Meknès', postalCode: '33000', deliveryFee: 45, sortOrder: 21 },
  { name: 'Ifrane', nameArabic: 'إفران', region: 'Fès-Meknès', postalCode: '53000', deliveryFee: 45, sortOrder: 22 },
  { name: 'Azrou', nameArabic: 'أزرو', region: 'Fès-Meknès', postalCode: '53100', deliveryFee: 45, sortOrder: 23 },
  { name: 'Khenifra', nameArabic: 'خنيفرة', region: 'Fès-Meknès', postalCode: '54000', deliveryFee: 50, sortOrder: 24 },

  // Marrakech-Safi Region
  { name: 'Marrakech', nameArabic: 'مراكش', region: 'Marrakech-Safi', postalCode: '40000', deliveryFee: 40, sortOrder: 25 },
  { name: 'Safi', nameArabic: 'آسفي', region: 'Marrakech-Safi', postalCode: '46000', deliveryFee: 40, sortOrder: 26 },
  { name: 'Essaouira', nameArabic: 'الصويرة', region: 'Marrakech-Safi', postalCode: '44000', deliveryFee: 45, sortOrder: 27 },
  { name: 'Kelaa des Sraghna', nameArabic: 'قلعة السراغنة', region: 'Marrakech-Safi', postalCode: '43000', deliveryFee: 45, sortOrder: 28 },
  { name: 'Youssoufia', nameArabic: 'اليوسفية', region: 'Marrakech-Safi', postalCode: '46200', deliveryFee: 45, sortOrder: 29 },
  { name: 'Chichaoua', nameArabic: 'شيشاوة', region: 'Marrakech-Safi', postalCode: '41000', deliveryFee: 50, sortOrder: 30 },

  // Oriental Region
  { name: 'Oujda', nameArabic: 'وجدة', region: 'Oriental', postalCode: '60000', deliveryFee: 50, sortOrder: 31 },
  { name: 'Nador', nameArabic: 'الناظور', region: 'Oriental', postalCode: '62000', deliveryFee: 50, sortOrder: 32 },
  { name: 'Berkane', nameArabic: 'بركان', region: 'Oriental', postalCode: '63300', deliveryFee: 50, sortOrder: 33 },
  { name: 'Taourirt', nameArabic: 'تاوريرت', region: 'Oriental', postalCode: '61000', deliveryFee: 55, sortOrder: 34 },
  { name: 'Jerada', nameArabic: 'جرادة', region: 'Oriental', postalCode: '61900', deliveryFee: 55, sortOrder: 35 },
  { name: 'Al Hoceima', nameArabic: 'الحسيمة', region: 'Oriental', postalCode: '32000', deliveryFee: 55, sortOrder: 36 },
  { name: 'Driouch', nameArabic: 'الدريوش', region: 'Oriental', postalCode: '32350', deliveryFee: 55, sortOrder: 37 },

  // Tanger-Tétouan-Al Hoceïma Region
  { name: 'Tanger', nameArabic: 'طنجة', region: 'Tanger-Tétouan-Al Hoceïma', postalCode: '90000', deliveryFee: 45, sortOrder: 38 },
  { name: 'Tétouan', nameArabic: 'تطوان', region: 'Tanger-Tétouan-Al Hoceïma', postalCode: '93000', deliveryFee: 45, sortOrder: 39 },
  { name: 'Larache', nameArabic: 'العرائش', region: 'Tanger-Tétouan-Al Hoceïma', postalCode: '92000', deliveryFee: 45, sortOrder: 40 },
  { name: 'Ksar El Kebir', nameArabic: 'القصر الكبير', region: 'Tanger-Tétouan-Al Hoceïma', postalCode: '92300', deliveryFee: 45, sortOrder: 41 },
  { name: 'Asilah', nameArabic: 'أصيلة', region: 'Tanger-Tétouan-Al Hoceïma', postalCode: '90055', deliveryFee: 45, sortOrder: 42 },
  { name: 'Chefchaouen', nameArabic: 'شفشاون', region: 'Tanger-Tétouan-Al Hoceïma', postalCode: '91000', deliveryFee: 50, sortOrder: 43 },
  { name: 'Ouazzane', nameArabic: 'وزان', region: 'Tanger-Tétouan-Al Hoceïma', postalCode: '91100', deliveryFee: 50, sortOrder: 44 },

  // Souss-Massa Region
  { name: 'Agadir', nameArabic: 'أكادير', region: 'Souss-Massa', postalCode: '80000', deliveryFee: 45, sortOrder: 45 },
  { name: 'Inezgane', nameArabic: 'إنزكان', region: 'Souss-Massa', postalCode: '80350', deliveryFee: 45, sortOrder: 46 },
  { name: 'Taroudant', nameArabic: 'تارودانت', region: 'Souss-Massa', postalCode: '83000', deliveryFee: 50, sortOrder: 47 },
  { name: 'Tiznit', nameArabic: 'تيزنيت', region: 'Souss-Massa', postalCode: '85000', deliveryFee: 50, sortOrder: 48 },
  { name: 'Ouarzazate', nameArabic: 'ورزازات', region: 'Souss-Massa', postalCode: '45000', deliveryFee: 55, sortOrder: 49 },
  { name: 'Zagora', nameArabic: 'زاكورة', region: 'Souss-Massa', postalCode: '47900', deliveryFee: 60, sortOrder: 50 },

  // Drâa-Tafilalet Region
  { name: 'Errachidia', nameArabic: 'الراشيدية', region: 'Drâa-Tafilalet', postalCode: '52000', deliveryFee: 55, sortOrder: 51 },
  { name: 'Midelt', nameArabic: 'ميدلت', region: 'Drâa-Tafilalet', postalCode: '54350', deliveryFee: 55, sortOrder: 52 },
  { name: 'Tinghir', nameArabic: 'تنغير', region: 'Drâa-Tafilalet', postalCode: '45800', deliveryFee: 60, sortOrder: 53 },
  { name: 'Rissani', nameArabic: 'الريصاني', region: 'Drâa-Tafilalet', postalCode: '52450', deliveryFee: 60, sortOrder: 54 },

  // Beni Mellal-Khénifra Region
  { name: 'Beni Mellal', nameArabic: 'بني ملال', region: 'Beni Mellal-Khénifra', postalCode: '23000', deliveryFee: 40, sortOrder: 55 },
  { name: 'Khouribga', nameArabic: 'خريبكة', region: 'Beni Mellal-Khénifra', postalCode: '25000', deliveryFee: 40, sortOrder: 56 },
  { name: 'Fquih Ben Salah', nameArabic: 'الفقيه بن صالح', region: 'Beni Mellal-Khénifra', postalCode: '23200', deliveryFee: 45, sortOrder: 57 },
  { name: 'Kasba Tadla', nameArabic: 'قصبة تادلة', region: 'Beni Mellal-Khénifra', postalCode: '23150', deliveryFee: 45, sortOrder: 58 },

  // Laâyoune-Sakia El Hamra Region (Western Sahara)
  { name: 'Laâyoune', nameArabic: 'العيون', region: 'Laâyoune-Sakia El Hamra', postalCode: '70000', deliveryFee: 80, sortOrder: 59 },
  { name: 'Smara', nameArabic: 'السمارة', region: 'Laâyoune-Sakia El Hamra', postalCode: '72000', deliveryFee: 100, sortOrder: 60 },
  { name: 'Boujdour', nameArabic: 'بوجدور', region: 'Laâyoune-Sakia El Hamra', postalCode: '71000', deliveryFee: 90, sortOrder: 61 },

  // Dakhla-Oued Ed-Dahab Region (Western Sahara)
  { name: 'Dakhla', nameArabic: 'الداخلة', region: 'Dakhla-Oued Ed-Dahab', postalCode: '73000', deliveryFee: 120, sortOrder: 62 },

  // Guelmim-Oued Noun Region
  { name: 'Guelmim', nameArabic: 'كلميم', region: 'Guelmim-Oued Noun', postalCode: '81000', deliveryFee: 60, sortOrder: 63 },
  { name: 'Tan-Tan', nameArabic: 'طانطان', region: 'Guelmim-Oued Noun', postalCode: '82000', deliveryFee: 70, sortOrder: 64 },
  { name: 'Sidi Ifni', nameArabic: 'سيدي إفني', region: 'Guelmim-Oued Noun', postalCode: '85200', deliveryFee: 65, sortOrder: 65 },

  // Additional important cities
  { name: 'Ain Harrouda', nameArabic: 'عين حرودة', region: 'Casablanca-Settat', postalCode: '20470', deliveryFee: 30, sortOrder: 66 },
  { name: 'Bouznika', nameArabic: 'بوزنيقة', region: 'Casablanca-Settat', postalCode: '13100', deliveryFee: 35, sortOrder: 67 },
  { name: 'Had Soualem', nameArabic: 'حد السوالم', region: 'Casablanca-Settat', postalCode: '26900', deliveryFee: 35, sortOrder: 68 },
  { name: 'Benslimane', nameArabic: 'بن سليمان', region: 'Casablanca-Settat', postalCode: '13000', deliveryFee: 35, sortOrder: 69 },
];

async function seedMoroccanCities() {
  try {
    console.log('🇲🇦 Starting to seed Moroccan cities...');
    
    // Connect to database
    await connectDB();
    console.log('✅ Connected to database');

    // Find an admin user to assign as creator
    const adminUser = await User.findOne({ role: { $in: ['admin', 'manager'] } });
    
    if (!adminUser) {
      console.log('❌ No admin user found. Please create an admin user first.');
      return;
    }

    console.log(`👤 Using admin user: ${adminUser.firstName} ${adminUser.lastName}`);

    let successCount = 0;
    let errorCount = 0;
    let skippedCount = 0;

    for (const cityData of moroccanCities) {
      try {
        // Check if city already exists
        const existingCity = await City.findOne({ name: cityData.name });
        
        if (existingCity) {
          console.log(`⏭️  ${cityData.name} already exists, skipping...`);
          skippedCount++;
          continue;
        }

        // Create new city
        const newCity = new City({
          ...cityData,
          deliveryAvailable: true,
          isActive: true,
          createdBy: adminUser._id
        });

        await newCity.save();
        console.log(`✅ ${cityData.name} (${cityData.nameArabic}) - ${cityData.region}`);
        successCount++;
        
      } catch (error) {
        console.log(`❌ Failed to create ${cityData.name}: ${error.message}`);
        errorCount++;
      }
    }

    console.log(`\n🎉 Seeding complete!`);
    console.log(`✅ Successfully created: ${successCount} cities`);
    console.log(`⏭️  Skipped (already exists): ${skippedCount} cities`);
    console.log(`❌ Failed: ${errorCount} cities`);
    console.log(`📊 Total cities in database: ${await City.countDocuments()}`);

  } catch (error) {
    console.error('❌ Error seeding cities:', error);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// Run the seeding
seedMoroccanCities();

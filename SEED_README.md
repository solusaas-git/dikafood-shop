# 🇲🇦 DIKAFOOD - Moroccan Cities Seed Script

## Overview
This repository contains a comprehensive seed script to populate the database with all major Moroccan cities organized by regions.

## 📊 Statistics
- **Total Cities**: 69 cities
- **Regions Covered**: 12 administrative regions
- **Coverage**: All major cities and towns across Morocco including Western Sahara

## 🚀 Usage

### Quick Start
```bash
npm run seed:cities
```

### Manual Execution
```bash
node seed-moroccan-cities.js
```

## 🗺️ Regions Covered

### 1. **Casablanca-Settat** (8 cities)
- Casablanca, Settat, Mohammedia, El Jadida, Berrechid, Azemmour, Sidi Bennour, Ben Ahmed, Ain Harrouda, Bouznika, Had Soualem, Benslimane

### 2. **Rabat-Salé-Kénitra** (8 cities)
- Rabat, Salé, Kénitra, Témara, Skhirat, Khémisset, Sidi Kacem, Sidi Slimane

### 3. **Fès-Meknès** (8 cities)
- Fès, Meknès, Taza, Sefrou, El Hajeb, Ifrane, Azrou, Khenifra

### 4. **Marrakech-Safi** (6 cities)
- Marrakech, Safi, Essaouira, Kelaa des Sraghna, Youssoufia, Chichaoua

### 5. **Oriental** (7 cities)
- Oujda, Nador, Berkane, Taourirt, Jerada, Al Hoceima, Driouch

### 6. **Tanger-Tétouan-Al Hoceïma** (7 cities)
- Tanger, Tétouan, Larache, Ksar El Kebir, Asilah, Chefchaouen, Ouazzane

### 7. **Souss-Massa** (6 cities)
- Agadir, Inezgane, Taroudant, Tiznit, Ouarzazate, Zagora

### 8. **Drâa-Tafilalet** (4 cities)
- Errachidia, Midelt, Tinghir, Rissani

### 9. **Beni Mellal-Khénifra** (4 cities)
- Beni Mellal, Khouribga, Fquih Ben Salah, Kasba Tadla

### 10. **Laâyoune-Sakia El Hamra** (3 cities)
- Laâyoune, Smara, Boujdour

### 11. **Dakhla-Oued Ed-Dahab** (1 city)
- Dakhla

### 12. **Guelmim-Oued Noun** (3 cities)
- Guelmim, Tan-Tan, Sidi Ifni

## 💰 Delivery Pricing Structure

The cities are configured with delivery fees based on their location and accessibility:

- **Major Cities** (Casablanca, Rabat, Salé): 30-35 MAD
- **Regional Centers**: 40-45 MAD
- **Remote Cities**: 50-60 MAD
- **Western Sahara**: 80-120 MAD (higher due to distance)

## 🏗️ Database Structure

Each city includes:
- **name**: French name
- **nameArabic**: Arabic name (العربية)
- **region**: Administrative region
- **postalCode**: Official postal code
- **deliveryFee**: Delivery cost in MAD
- **sortOrder**: Display priority
- **deliveryAvailable**: true (all cities)
- **isActive**: true (all cities)
- **createdBy**: Admin user ID

## 🔧 Technical Details

### Prerequisites
- MongoDB connection configured
- Admin user exists in database
- Environment variables set in `.env.local`

### Dependencies
- `mongoose`: Database ODM
- `dotenv`: Environment configuration

### Features
- ✅ **Duplicate Prevention**: Skips existing cities
- ✅ **Error Handling**: Comprehensive error reporting
- ✅ **Progress Tracking**: Real-time seeding progress
- ✅ **Database Validation**: Uses existing City model validation
- ✅ **Auto-Assignment**: Automatically assigns admin user as creator

## 📝 Future Enhancements

- Add GPS coordinates for each city
- Include population data
- Add delivery zones within cities
- Support for multiple languages
- Import/export functionality

## 🛠️ Maintenance

To update the seed data:
1. Edit `seed-moroccan-cities.js`
2. Run the script again (existing cities will be skipped)
3. New cities will be added automatically

---

**Created by**: DIKAFOOD Development Team  
**Last Updated**: December 2024  
**Version**: 1.0.0

import { Drop, Fire, Leaf, ShieldCheck, Bandaids, MapPin } from "@phosphor-icons/react";

// Consolidated product data for the entire application
export const products = [
    {
        id: 'dika-premium',
        brand: 'Dika',
        name: 'Huile d\'Olive Extra Vierge Premium',
        description: 'Notre huile d\'olive premium, pressée à froid et soigneusement sélectionnée pour sa qualité exceptionnelle. Issue de la première pression de nos olives cultivées dans les régions montagneuses de Fès-Meknès, cette huile d\'olive extra vierge se distingue par sa pureté et sa saveur fruitée intense avec des notes d\'herbes fraîches et une légère touche poivrée en fin de bouche.',
        shortDescription: 'Notre huile d\'olive premium, pressée à froid et soigneusement sélectionnée pour sa qualité exceptionnelle.',
        variants: [
            {
                id: 'dika-premium-500ml',
                size: '500ml',
                image: '/images/products/dika-500ML.png',
                price: 74.99,
                stock: 45
            },
            {
                id: 'dika-premium-5L',
                size: '5L',
                image: '/images/products/dika-5L.png',
                price: 499.99,
                stock: 20
            }
        ],
        features: [
            {
                icon: Leaf,
                text: 'Pressée à froid'
            },
            {
                icon: ShieldCheck,
                text: 'Extra vierge'
            }
        ],
        benefits: [
            'Riche en antioxydants naturels',
            'Source d\'acides gras mono-insaturés',
            'Sans conservateurs ni additifs',
            'Parfaite pour les assaisonnements et la cuisine à basse température'
        ],
        nutritionalInfo: {
            servingSize: '15ml',
            calories: 120,
            fat: '14g',
            saturatedFat: '2g',
            monounsaturatedFat: '10g',
            polyunsaturatedFat: '2g',
            sodium: '0mg',
            carbs: '0g',
            protein: '0g',
            vitaminE: '10%'
        },
        acidity: '0.2%',
        origin: 'Fès-Meknès, Maroc',
        category: 'premium',
        rating: 4.9,
        reviewCount: 168,
        isNew: true,
        isBestseller: true,
        isInStock: true,
        relatedProducts: ['ouedfes-classic', 'chourouk-grignons', 'biladi-huile-de-table']
    },
    {
        id: 'ouedfes-classic',
        brand: 'Oued Fès',
        name: 'Huile d\'Olive Extra Vierge Classique',
        description: 'Une huile d\'olive traditionnelle produite dans la région de Fès-Meknès, riche en saveurs et en bienfaits nutritionnels. Extraite d\'olives sélectionnées avec soin et pressée selon des méthodes traditionnelles qui préservent toutes ses qualités, cette huile est parfaite pour votre cuisine quotidienne et pour apprécier le goût authentique de l\'olive marocaine.',
        shortDescription: 'Une huile d\'olive traditionnelle, riche en saveurs et en bienfaits nutritionnels.',
        variants: [
            {
                id: 'ouedfes-classic-1L',
                size: '1L',
                image: '/images/products/ouedfes-1L.png',
                price: 69.99,
                stock: 30
            }
        ],
        features: [
            {
                icon: Drop,
                text: 'Pure'
            },
            {
                icon: ShieldCheck,
                text: 'Extra vierge'
            }
        ],
        benefits: [
            'Saveur authentique et équilibrée',
            'Idéale pour la cuisine quotidienne',
            'Source d\'acides gras essentiels',
            'Produite selon des méthodes traditionnelles'
        ],
        nutritionalInfo: {
            servingSize: '15ml',
            calories: 120,
            fat: '14g',
            saturatedFat: '2g',
            monounsaturatedFat: '9g',
            polyunsaturatedFat: '3g',
            sodium: '0mg',
            carbs: '0g',
            protein: '0g',
            vitaminE: '8%'
        },
        acidity: '0.3%',
        origin: 'Fès-Meknès, Maroc',
        category: 'classic',
        rating: 4.7,
        reviewCount: 142,
        isNew: false,
        isBestseller: true,
        isInStock: true,
        relatedProducts: ['dika-premium', 'chourouk-grignons', 'nouarati-tournesol']
    },
    {
        id: 'nouarati-tournesol',
        brand: 'Nouarati',
        name: 'Huile de Tournesol Raffinée',
        description: 'Huile de tournesol pure et légère, idéale pour la cuisine quotidienne. Cette huile polyvalente est parfaite pour la friture, la cuisson et les pâtisseries grâce à son point de fumée élevé et son goût neutre qui ne masque pas les saveurs de vos ingrédients. Produite à partir de graines de tournesol sélectionnées et raffinée selon des normes strictes de qualité.',
        shortDescription: 'Huile de tournesol pure et légère, idéale pour la cuisine quotidienne.',
        variants: [
            {
                id: 'nouarati-tournesol-1L',
                size: '1L',
                image: '/images/products/nouarti-1L.png',
                price: 16.99,
                stock: 60
            },
            {
                id: 'nouarati-tournesol-2L',
                size: '2L',
                image: '/images/products/nouarti-2L.png',
                price: 33.99,
                stock: 45
            },
            {
                id: 'nouarati-tournesol-5L',
                size: '5L',
                image: '/images/products/nouarti-5L.png',
                price: 84.99,
                stock: 25
            }
        ],
        features: [
            {
                icon: Fire,
                text: 'Haute température'
            },
            {
                icon: ShieldCheck,
                text: 'Sans cholestérol'
            }
        ],
        benefits: [
            'Point de fumée élevé idéal pour la friture',
            'Goût neutre qui préserve les saveurs de vos plats',
            'Riche en vitamine E',
            'Source d\'acides gras essentiels'
        ],
        nutritionalInfo: {
            servingSize: '15ml',
            calories: 120,
            fat: '14g',
            saturatedFat: '1.5g',
            monounsaturatedFat: '3.5g',
            polyunsaturatedFat: '9g',
            sodium: '0mg',
            carbs: '0g',
            protein: '0g',
            vitaminE: '15%'
        },
        origin: 'Maroc',
        category: 'cooking',
        rating: 4.5,
        reviewCount: 98,
        isNew: false,
        isBestseller: false,
        isInStock: true,
        relatedProducts: ['chourouk-grignons', 'biladi-huile-de-table', 'ouedfes-classic']
    },
    {
        id: 'chourouk-grignons',
        brand: 'Chourouk',
        name: 'Huile de Grignons d\'Olive',
        description: 'Huile de grignons d\'olive, économique et polyvalente pour tous types de cuisson. Obtenue à partir des résidus d\'olive après la première pression, cette huile offre une alternative économique pour la cuisine quotidienne, particulièrement adaptée pour la friture grâce à sa stabilité à haute température. Son goût léger met en valeur les saveurs de vos préparations.',
        shortDescription: 'Huile de grignons d\'olive, économique et polyvalente pour tous types de cuisson.',
        variants: [
            {
                id: 'chourouk-grignons-10L',
                size: '10L',
                image: '/images/products/chourouk-10L.png',
                price: 147.99,
                stock: 15
            },
            {
                id: 'chourouk-grignons-25L',
                size: '25L',
                image: '/images/products/chourouk-25L.png',
                price: 399.99,
                stock: 8
            }
        ],
        features: [
            {
                icon: Fire,
                text: 'Idéale pour la cuisson'
            },
            {
                icon: ShieldCheck,
                text: 'Qualité garantie'
            }
        ],
        benefits: [
            'Excellente résistance aux hautes températures',
            'Option économique pour la cuisine en grande quantité',
            'Saveur légère qui ne domine pas les plats',
            'Parfaite pour les fritures et cuissons à haute température'
        ],
        nutritionalInfo: {
            servingSize: '15ml',
            calories: 120,
            fat: '14g',
            saturatedFat: '2.5g',
            monounsaturatedFat: '8g',
            polyunsaturatedFat: '3.5g',
            sodium: '0mg',
            carbs: '0g',
            protein: '0g',
            vitaminE: '5%'
        },
        origin: 'Maroc',
        category: 'cooking',
        rating: 4.3,
        reviewCount: 74,
        isNew: false,
        isBestseller: false,
        isInStock: true,
        relatedProducts: ['nouarati-tournesol', 'biladi-huile-de-table', 'dika-premium']
    },
    {
        id: 'biladi-huile-de-table',
        brand: 'Biladi',
        name: 'Huile de Table',
        description: 'Huile de table polyvalente, idéale pour la cuisson quotidienne et les salades. Composée d\'un mélange équilibré d\'huiles végétales soigneusement sélectionnées, cette huile de table offre un excellent rapport qualité-prix pour toutes vos préparations culinaires. Sa formulation lui confère une bonne résistance à la chaleur tout en préservant une saveur neutre.',
        shortDescription: 'Huile de table, idéale pour la cuisson et la salade.',
        variants: [
            {
                id: 'biladi-huile-de-table-1L',
                size: '1L',
                image: '/images/products/chourouk-1L.png',
                price: 44.99,
                stock: 50
            }
        ],
        features: [
            {
                icon: Fire,
                text: 'Idéale pour la cuisson'
            },
            {
                icon: ShieldCheck,
                text: 'Qualité garantie'
            }
        ],
        benefits: [
            'Polyvalente pour tous types de préparations',
            'Saveur neutre adaptée à toutes les cuisines',
            'Bon rapport qualité-prix',
            'Idéale pour la cuisine quotidienne'
        ],
        nutritionalInfo: {
            servingSize: '15ml',
            calories: 120,
            fat: '14g',
            saturatedFat: '2g',
            monounsaturatedFat: '6g',
            polyunsaturatedFat: '6g',
            sodium: '0mg',
            carbs: '0g',
            protein: '0g',
            vitaminE: '6%'
        },
        origin: 'Maroc',
        category: 'cooking',
        rating: 4.2,
        reviewCount: 56,
        isNew: false,
        isBestseller: false,
        isInStock: true,
        relatedProducts: ['nouarati-tournesol', 'chourouk-grignons', 'ouedfes-classic']
    }
];

// Categories for product filtering
export const productCategories = [
    { id: 'all', name: 'Tous les produits', count: products.length },
    { id: 'premium', name: 'Huile d\'Olive Premium', count: products.filter(p => p.category === 'premium').length },
    { id: 'classic', name: 'Huile d\'Olive Classique', count: products.filter(p => p.category === 'classic').length },
    { id: 'cooking', name: 'Huiles de Cuisson', count: products.filter(p => p.category === 'cooking').length }
];

// Function to get a product by ID
export const getProductById = (id) => {
    return products.find(product => product.id === id);
};

/**
 * Get related products by category
 * @param {string} currentProductId - Current product ID to exclude from results
 * @param {string} category - Category to filter by
 * @returns {Promise<Array>} - Array of related products
 */
export const getRelatedProducts = async (currentProductId, category) => {
  // In a real app, this would be an API call with filters
  // Here we'll simulate by filtering the mock data

  // Filter products by category and exclude current product
  const related = products.filter(product =>
    product.id !== currentProductId &&
    product.category === category
  );

  // If we don't have enough products in the same category, add some from other categories
  if (related.length < 4) {
    const otherProducts = products.filter(product =>
      product.id !== currentProductId &&
      product.category !== category
    );

    // Randomly select enough products to have at least 4 recommendations
    const neededCount = 4 - related.length;
    const randomProducts = otherProducts
      .sort(() => 0.5 - Math.random()) // Shuffle array
      .slice(0, neededCount);

    return [...related, ...randomProducts];
  }

  return related;
};

// Function to get all products in a category
export const getProductsByCategory = (categoryId) => {
    if (categoryId === 'all') return products;
    return products.filter(product => product.category === categoryId);
};
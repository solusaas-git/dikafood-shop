import { Drop, Fire, Leaf, ShieldCheck } from "@phosphor-icons/react";

export const carouselProducts = [
    {
        id: 'dika-premium',
        brand: 'Dika',
        name: 'Huile d\'Olive Extra Vierge Premium',
        description: 'Notre huile d\'olive premium, pressée à froid et soigneusement sélectionnée pour sa qualité exceptionnelle.',
        variants: [
            {
                size: '500ml',
                image: '/images/products/dika-500ML.png',
                price: '74.99'
            },
            {
                size: '5L',
                image: '/images/products/dika-5L.png',
                price: '499.99'
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
        acidity: '0.2%',
        origin: 'Fès-Meknès, Maroc',
        category: 'premium'
    },
    {
        id: 'ouedfes-classic',
        brand: 'Oued Fès',
        name: 'Huile d\'Olive Extra Vierge Classique',
        description: 'Une huile d\'olive traditionnelle, riche en saveurs et en bienfaits nutritionnels.',
        variants: [
            {
                size: '1L',
                image: '/images/products/ouedfes-1L.png',
                price: '69.99'
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
        acidity: '0.3%',
        origin: 'Fès-Meknès, Maroc',
        category: 'classic'
    },
    {
        id: 'nouarati-tournesol',
        brand: 'Nouarati',
        name: 'Huile de Tournesol Raffinée',
        description: 'Huile de tournesol pure et légère, idéale pour la cuisine quotidienne.',
        variants: [
            {
                size: '1L',
                image: '/images/products/nouarti-1L.png',
                price: '16.99'
            },
            {
                size: '2L',
                image: '/images/products/nouarti-2L.png',
                price: '33.99'
            },
            {
                size: '5L',
                image: '/images/products/nouarti-5L.png',
                price: '84.99'
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
        origin: 'Maroc',
        category: 'cooking'
    },
    {
        id: 'chourouk-grignons',
        brand: 'Chourouk',
        name: 'Huile de Grignons d\'Olive',
        description: 'Huile de grignons d\'olive, économique et polyvalente pour tous types de cuisson.',
        variants: [
            {
                size: '1L',
                image: '/images/products/chourouk-1L.png',
                price: '--'
            },
            {
                size: '10L',
                image: '/images/products/chourouk-10L.png',
                price: '147.99'
            },
            {
                size: '25L',
                image: '/images/products/chourouk-25L.png',
                price: '399.99'
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
        origin: 'Maroc',
        category: 'cooking'
    }
]; 
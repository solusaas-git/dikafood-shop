// Translation keys organized by section and component
const translations = {
  // Common UI Elements
  common: {
    buttons: {
      submit: {
        fr: 'Envoyer',
        en: 'Submit'
      },
      download: {
        fr: 'Télécharger',
        en: 'Download'
      },
      readMore: {
        fr: 'Lire plus',
        en: 'Read more'
      },
      subscribe: {
        fr: 'S\'abonner',
        en: 'Subscribe'
      },
      contactUs: {
        fr: 'Contactez-nous',
        en: 'Contact us'
      }
    },
    form: {
      name: {
        fr: 'Nom',
        en: 'Last name'
      },
      firstName: {
        fr: 'Prénom',
        en: 'First name'
      },
      email: {
        fr: 'Email',
        en: 'Email'
      },
      phone: {
        fr: 'Numéro de téléphone',
        en: 'Phone number'
      },
      message: {
        fr: 'Message',
        en: 'Message'
      },
      required: {
        fr: 'Ce champ est requis',
        en: 'This field is required'
      },
      invalidEmail: {
        fr: 'Veuillez entrer une adresse email valide',
        en: 'Please enter a valid email address'
      },
      invalidPhone: {
        fr: 'Veuillez entrer un numéro de téléphone valide',
        en: 'Please enter a valid phone number'
      }
    },
    errors: {
      general: {
        fr: 'Une erreur est survenue. Veuillez réessayer.',
        en: 'An error occurred. Please try again.'
      },
      timeout: {
        fr: 'La demande a expiré. Veuillez réessayer.',
        en: 'The request timed out. Please try again.'
      }
    },
    success: {
      formSubmitted: {
        fr: 'Formulaire envoyé avec succès!',
        en: 'Form submitted successfully!'
      },
      subscribed: {
        fr: 'Merci pour votre inscription!',
        en: 'Thanks for subscribing!'
      }
    }
  },

  // Navigation
  nav: {
    home: {
      fr: 'Accueil',
      en: 'Home'
    },
    about: {
      fr: 'À propos',
      en: 'About'
    },
    shop: {
      fr: 'Boutique',
      en: 'Shop'
    },
    products: {
      fr: 'Produits',
      en: 'Products'
    },
    blog: {
      fr: 'Blog',
      en: 'Blog'
    },
    contact: {
      fr: 'Contact',
      en: 'Contact'
    }
  },

  // Home Page Sections
  home: {
    hero: {
      title: {
        fr: 'L\'excellence de l\'huile d\'olive marocaine',
        en: 'Excellence in Moroccan olive oil'
      },
      subtitle: {
        fr: 'Découvrez nos produits authentiques et de qualité supérieure',
        en: 'Discover our authentic, premium quality products'
      },
      cta: {
        fr: 'Découvrir nos produits',
        en: 'Discover our products'
      }
    },
    benefits: {
      title: {
        fr: 'Pourquoi choisir DikaFood?',
        en: 'Why choose DikaFood?'
      },
      subtitle: {
        fr: 'Notre engagement pour la qualité et l\'authenticité',
        en: 'Our commitment to quality and authenticity'
      },
      items: [
        {
          title: {
            fr: 'Qualité supérieure',
            en: 'Superior quality'
          },
          description: {
            fr: 'Nos produits sont sélectionnés selon des standards rigoureux',
            en: 'Our products are selected according to rigorous standards'
          }
        },
        {
          title: {
            fr: 'Production durable',
            en: 'Sustainable production'
          },
          description: {
            fr: 'Nous respectons l\'environnement à chaque étape',
            en: 'We respect the environment at every step'
          }
        },
        {
          title: {
            fr: 'Tradition marocaine',
            en: 'Moroccan tradition'
          },
          description: {
            fr: 'Un savoir-faire ancestral transmis de génération en génération',
            en: 'An ancestral know-how passed down through generations'
          }
        }
      ]
    },
    catalog: {
      title: {
        fr: 'Téléchargez le catalogue',
        en: 'Download the catalog'
      },
      subtitle: {
        fr: 'Remplissez le formulaire pour recevoir notre catalogue détaillé',
        en: 'Fill out the form to receive our detailed catalog'
      }
    },
    contact: {
      title: {
        fr: 'Contactez-nous',
        en: 'Contact us'
      },
      subtitle: {
        fr: 'Nous sommes là pour répondre à toutes vos questions',
        en: 'We are here to answer all your questions'
      },
      info: {
        title: {
          fr: 'Nos Coordonnées',
          en: 'Our Contact Information'
        },
        subtitle: {
          fr: 'Plusieurs façons de nous contacter',
          en: 'Multiple ways to reach us'
        }
      },
      form: {
        title: {
          fr: 'Envoyez-nous un message',
          en: 'Send us a message'
        },
        subtitle: {
          fr: 'Nous vous répondrons dans les plus brefs délais',
          en: 'We will respond as soon as possible'
        }
      }
    }
  },

  // Blog Page
  blog: {
    title: {
      fr: 'Notre Journal',
      en: 'Our Blog'
    },
    subtitle: {
      fr: 'L\'Art de l\'Huile d\'Olive',
      en: 'The Art of Olive Oil'
    },
    hero: {
      title: {
        fr: 'Découvrez',
        en: 'Discover'
      },
      tagline: {
        fr: 'Notre Blog Culinaire',
        en: 'Our Culinary Blog'
      },
      description: {
        fr: 'Explorez les saveurs authentiques de la cuisine marocaine à travers nos articles et recettes.',
        en: 'Explore authentic Moroccan cuisine flavors through our articles and recipes.'
      },
      featured: {
        fr: 'À la une',
        en: 'Featured'
      },
      readArticle: {
        fr: 'Lire l\'article',
        en: 'Read article'
      }
    },
    newsletter: {
      title: {
        fr: 'Restez Informé',
        en: 'Stay Informed'
      },
      subtitle: {
        fr: 'Recevez nos derniers articles et actualités directement dans votre boîte mail',
        en: 'Receive our latest articles and news directly in your inbox'
      },
      placeholder: {
        fr: 'Votre adresse email',
        en: 'Your email address'
      }
    },
    featured: {
      title: {
        fr: 'Articles à la Une',
        en: 'Featured Articles'
      }
    },
    categories: {
      all: {
        fr: 'Tous les articles',
        en: 'All articles'
      },
      production: {
        fr: 'Production',
        en: 'Production'
      },
      health: {
        fr: 'Santé & Bien-être',
        en: 'Health & Wellness'
      },
      tips: {
        fr: 'Conseils & Astuces',
        en: 'Tips & Tricks'
      },
      news: {
        fr: 'Actualités',
        en: 'News'
      },
      recipes: {
        fr: 'Recettes',
        en: 'Recipes'
      }
    },
    readTime: {
      fr: 'min de lecture',
      en: 'min read'
    }
  },

  // Footer
  footer: {
    company: {
      about: {
        fr: 'À propos',
        en: 'About'
      },
      history: {
        fr: 'Notre histoire',
        en: 'Our history'
      },
      values: {
        fr: 'Nos valeurs',
        en: 'Our values'
      }
    },
    legal: {
      terms: {
        fr: 'Conditions générales',
        en: 'Terms of service'
      },
      privacy: {
        fr: 'Politique de confidentialité',
        en: 'Privacy policy'
      }
    },
    contact: {
      title: {
        fr: 'Contact',
        en: 'Contact'
      },
      address: {
        fr: '18 Rue Zenata Quartier Industriel Dokkarat, Fes, Maroc',
        en: '18 Rue Zenata Quartier Industriel Dokkarat, Fes, Morocco'
      }
    },
    copyright: {
      fr: '© 2024 DikaFood. Tous droits réservés.',
      en: '© 2024 DikaFood. All rights reserved.'
    }
  },

  shop: {
    en: {
      title: "Our Products",
      subtitle: "Discover our selection of premium African products",
      filterTitle: "Filter Products",
      categories: "Categories",
      allCategories: "All Categories",
      priceRange: "Price Range",
      filterAttributes: "Product Attributes",
      inStock: "In Stock",
      newArrival: "New Arrival",
      bestseller: "Bestseller",
      clearFilters: "Clear Filters",
      sortBy: "Sort by",
      sortOptions: {
        featured: "Featured",
        priceLowToHigh: "Price: Low to High",
        priceHighToLow: "Price: High to Low",
        newest: "Newest",
        bestSelling: "Best Selling"
      },
      searchPlaceholder: "Search products...",
      noProducts: "No products found",
      noProductsDescription: "Try adjusting your filters or search to find what you're looking for",
      showResults: "Showing {count} results",
      addToCart: "Add to Cart",
      outOfStock: "Out of Stock",
      cart: {
        title: "Your Cart",
        empty: "Your cart is empty",
        emptyDescription: "Start shopping to add products to your cart",
        continueShopping: "Continue Shopping",
        summary: "Order Summary",
        subtotal: "Subtotal",
        shipping: "Shipping",
        tax: "Tax",
        savings: "Savings",
        total: "Total",
        checkout: "Proceed to Checkout",
        item: "item",
        items: "items"
      }
    },
    fr: {
      title: "Nos Produits",
      subtitle: "Découvrez notre sélection de produits africains premium",
      filterTitle: "Filtrer les Produits",
      categories: "Catégories",
      allCategories: "Toutes les Catégories",
      priceRange: "Fourchette de Prix",
      filterAttributes: "Attributs du Produit",
      inStock: "En Stock",
      newArrival: "Nouveauté",
      bestseller: "Meilleures Ventes",
      clearFilters: "Effacer les Filtres",
      sortBy: "Trier par",
      sortOptions: {
        featured: "En Vedette",
        priceLowToHigh: "Prix: Croissant",
        priceHighToLow: "Prix: Décroissant",
        newest: "Plus Récent",
        bestSelling: "Meilleures Ventes"
      },
      searchPlaceholder: "Rechercher des produits...",
      noProducts: "Aucun produit trouvé",
      noProductsDescription: "Essayez d'ajuster vos filtres ou votre recherche pour trouver ce que vous cherchez",
      showResults: "Affichage de {count} résultats",
      addToCart: "Ajouter au Panier",
      outOfStock: "Rupture de Stock",
      cart: {
        title: "Votre Panier",
        empty: "Votre panier est vide",
        emptyDescription: "Commencez vos achats pour ajouter des produits à votre panier",
        continueShopping: "Continuer vos Achats",
        summary: "Résumé de la Commande",
        subtotal: "Sous-total",
        shipping: "Livraison",
        tax: "Taxes",
        savings: "Économies",
        total: "Total",
        checkout: "Procéder au Paiement",
        item: "article",
        items: "articles"
      }
    }
  }
};

export default translations;
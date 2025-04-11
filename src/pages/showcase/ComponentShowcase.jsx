import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
    EnvelopeSimple,
    DownloadSimple,
    CaretRight,
    Calendar,
    Clock,
    ArrowRight,
    CheckCircle,
    House,
    Article,
    Info,
    Buildings,
    Medal,
    ChatCircleText,
    Question,
    ArrowDownRight,
    User,
    At,
    Phone,
    ShoppingCart,
    ShoppingBag,
    CreditCard,
    Tag,
    Star,
    Heart,
    Percent,
    Plus,
    Minus,
    Share,
    X
} from "@phosphor-icons/react";
import NavBar from '../../sections/shared/navbar/NavBar';
import Button from '../../components/buttons/Button';
import TranslatedText, {
    TranslatedHeading,
    TranslatedParagraph,
    TranslatedLabel,
    TranslatedButton
} from '../../components/ui/text/TranslatedText';
import { useLanguage } from '../../context/LanguageContext';
import { Carousel, CarouselSlide } from '../../components/ui/carousel/Carousel';
import SectionHeader from '../../components/ui/section/SectionHeader';
import BenefitCard from '../../components/cards/benefit/BenefitCard';
import ProductCard from '../../components/cards/product/ProductCard';
import CardReview from '../../components/cards/review/CardReview';
import Field from '../../components/forms/Field';
import Accordion from '../../components/ui/accordion/Accordion';
import MessageField from '../../components/forms/MessageField';
import Footer from '../../sections/shared/footer/Footer';
import './showcase.scss';

// Mock data
import { benefitsData } from '../../data/benefits';
import { brandsData } from '../../data/brands';
import { carouselProducts } from '../../data/carousel-products';
import reviewsData from '../../data/reviews.json';

// Mock data for e-commerce components
const mockProducts = [
    {
        id: 'prod-1',
        name: 'Huile d\'Olive Extra Vierge',
        price: 149,
        oldPrice: 199,
        discount: 25,
        rating: 4.8,
        reviewCount: 124,
        image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=400&auto=format&fit=crop',
        description: 'Notre huile d\'olive extra vierge, obtenue par première pression à froid, est produite à partir d\'olives soigneusement sélectionnées.',
        category: 'Huile d\'Olive',
        isNew: true,
        isBestseller: true,
        inStock: true,
        variants: [
            { id: 'var-1', name: '250ml', price: 79 },
            { id: 'var-2', name: '500ml', price: 149, isDefault: true },
            { id: 'var-3', name: '1L', price: 279 }
        ]
    },
    {
        id: 'prod-2',
        name: 'Huile de Tournesol',
        price: 99,
        rating: 4.6,
        reviewCount: 86,
        image: 'https://images.unsplash.com/photo-1519692933481-e162a57d6721?q=80&w=400&auto=format&fit=crop',
        description: 'Huile de tournesol légère et polyvalente, parfaite pour la cuisine quotidienne et la friture.',
        category: 'Huile de Tournesol',
        isNew: false,
        isBestseller: true,
        inStock: true,
        variants: [
            { id: 'var-4', name: '500ml', price: 99, isDefault: true },
            { id: 'var-5', name: '1L', price: 189 },
            { id: 'var-6', name: '2L', price: 349 }
        ]
    }
];

const mockOrderSummary = {
    items: [
        { id: 'item-1', name: 'Huile d\'Olive Extra Vierge (500ml)', price: 149, quantity: 2, subtotal: 298 },
        { id: 'item-2', name: 'Huile de Tournesol (1L)', price: 189, quantity: 1, subtotal: 189 }
    ],
    subtotal: 487,
    shipping: 0,
    tax: 97.4,
    total: 584.4
};

const ComponentShowcase = () => {
    const { language } = useLanguage();
    const [activeVariants, setActiveVariants] = useState(() => {
        // Initialize with first variant of each product
        const variants = {};
        carouselProducts.forEach(product => {
            if (product.variants?.length > 0) {
                variants[product.id] = product.variants[0];
            }
        });
        return variants;
    });

    // Add state for e-commerce components
    const [quantity, setQuantity] = useState(1);
    const [isFavorite, setIsFavorite] = useState(false);
    const [selectedVariant, setSelectedVariant] = useState('var-2');

    const mockBlogPost = {
        _id: 'mock-post-1',
        data: {
            title: 'Découvrez les bienfaits de l\'huile d\'olive',
            excerpt: 'L\'huile d\'olive est riche en antioxydants et en acides gras monoinsaturés, ce qui en fait un élément essentiel pour une alimentation saine.',
            category: 'Santé & Bien-être',
            image: '/assets/images/blog/olive-oil-benefits.jpg',
            readTime: 5
        },
        metadata: {
            publishedAt: '2024-04-12T10:00:00.000Z'
        }
    };

    // FAQ items for Accordion
    const faqItems = [
        { title: "Quels types d'huiles proposez-vous ?", content: "Nous offrons une gamme variée d'huiles de qualité supérieure, notamment l'huile d'olive extra vierge, l'huile de tournesol, et l'huile de grignons d'olive." },
        { title: "D'où proviennent vos huiles ?", content: "Nos huiles sont produites au Maroc, dans des régions réputées pour la qualité de leurs olives et graines, en utilisant des techniques respectueuses de l'environnement et des traditions locales." }
    ];

    return (
        <>
            <Helmet>
                <title>Component Showcase - DikaFood</title>
                <meta name="description" content="Showcase of UI components used in the DikaFood application" />
            </Helmet>

            <div className="component-showcase">
                <NavBar />

                <div className="showcase-content">
                    <header className="showcase-header">
                        <div className="container">
                            <h1>Component Showcase</h1>
                            <p>A visual library of UI components used throughout the DikaFood application</p>
                        </div>
                    </header>

                    <main className="container">
                        {/* Table of Contents */}
                        <section className="component-section" id="table-of-contents">
                            <h2>Table of Contents</h2>
                            <div className="toc-links">
                                <a href="#design-system">Design System</a>
                                <a href="#common-components">Common Components</a>
                                <a href="#hero-section">Hero Section</a>
                                <a href="#brands-section">Brands Section</a>
                                <a href="#benefits-section">Benefits Section</a>
                                <a href="#reviews-section">Reviews Section</a>
                                <a href="#catalog-section">Catalog Section</a>
                                <a href="#faq-section">FAQ Section</a>
                                <a href="#contact-section">Contact Section</a>
                                <a href="#footer-section">Footer Section</a>
                                <a href="#ecommerce-section" className="new-item">E-commerce Components</a>
                            </div>
                        </section>

                        {/* Design System */}
                        <section className="component-section" id="design-system">
                            <h2>Design System</h2>
                            <p>Core design elements that define the visual language of the application</p>

                            {/* Colors */}
                            <div className="component-subsection">
                                <h3>Color System</h3>
                                <p>The color palette used throughout the application</p>

                                <div className="color-section">
                                    <h4>Primary Colors</h4>
                                    <div className="color-grid">
                                        <div className="color-item">
                                            <div className="color-swatch" style={{ backgroundColor: '#0F8A38' }}></div>
                                            <div className="color-details">
                                                <span className="color-name">Primary</span>
                                                <span className="color-value">$primary-color</span>
                                            </div>
                                        </div>
                                        <div className="color-item">
                                            <div className="color-swatch" style={{ backgroundColor: '#410A5C' }}></div>
                                            <div className="color-details">
                                                <span className="color-name">Secondary</span>
                                                <span className="color-value">$secondary-color</span>
                                            </div>
                                        </div>
                                        <div className="color-item">
                                            <div className="color-swatch" style={{ backgroundColor: '#E5801A' }}></div>
                                            <div className="color-details">
                                                <span className="color-name">Accent</span>
                                                <span className="color-value">$accent-color</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="color-section">
                                    <h4>Green Shades</h4>
                                    <div className="color-grid">
                                        <div className="color-item">
                                            <div className="color-swatch" style={{ backgroundColor: '#0A5C25' }}></div>
                                            <div className="color-details">
                                                <span className="color-name">Dark Green 1</span>
                                                <span className="color-value">$dark-green-1</span>
                                            </div>
                                        </div>
                                        <div className="color-item">
                                            <div className="color-swatch" style={{ backgroundColor: '#0D732F' }}></div>
                                            <div className="color-details">
                                                <span className="color-name">Dark Green 2</span>
                                                <span className="color-value">$dark-green-2</span>
                                            </div>
                                        </div>
                                        <div className="color-item">
                                            <div className="color-swatch" style={{ backgroundColor: '#0F8A38' }}></div>
                                            <div className="color-details">
                                                <span className="color-name">Dark Green 3</span>
                                                <span className="color-value">$dark-green-3</span>
                                            </div>
                                        </div>
                                        <div className="color-item">
                                            <div className="color-swatch" style={{ backgroundColor: '#12A141' }}></div>
                                            <div className="color-details">
                                                <span className="color-name">Dark Green 4</span>
                                                <span className="color-value">$dark-green-4</span>
                                            </div>
                                        </div>
                                        <div className="color-item">
                                            <div className="color-swatch" style={{ backgroundColor: '#E8FCEF' }}></div>
                                            <div className="color-details">
                                                <span className="color-name">Light Green 1</span>
                                                <span className="color-value">$light-green-1</span>
                                            </div>
                                        </div>
                                        <div className="color-item">
                                            <div className="color-swatch" style={{ backgroundColor: '#D1FADF' }}></div>
                                            <div className="color-details">
                                                <span className="color-name">Light Green 2</span>
                                                <span className="color-value">$light-green-2</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="color-section">
                                    <h4>Yellow Shades</h4>
                                    <div className="color-grid">
                                        <div className="color-item">
                                            <div className="color-swatch" style={{ backgroundColor: '#EBEB47' }}></div>
                                            <div className="color-details">
                                                <span className="color-name">Dark Yellow 1</span>
                                                <span className="color-value">$dark-yellow-1</span>
                                            </div>
                                        </div>
                                        <div className="color-item">
                                            <div className="color-swatch" style={{ backgroundColor: '#FCFCE8' }}></div>
                                            <div className="color-details">
                                                <span className="color-name">Light Yellow 1</span>
                                                <span className="color-value">$light-yellow-1</span>
                                            </div>
                                        </div>
                                        <div className="color-item">
                                            <div className="color-swatch" style={{ backgroundColor: '#FAFAD1' }}></div>
                                            <div className="color-details">
                                                <span className="color-name">Light Yellow 2</span>
                                                <span className="color-value">$light-yellow-2</span>
                                            </div>
                                        </div>
                                        <div className="color-item">
                                            <div className="color-swatch" style={{ backgroundColor: '#F5F5A3' }}></div>
                                            <div className="color-details">
                                                <span className="color-name">Light Yellow 4</span>
                                                <span className="color-value">$light-yellow-4</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="color-section">
                                    <h4>Utility Colors</h4>
                                    <div className="color-grid">
                                        <div className="color-item">
                                            <div className="color-swatch" style={{ backgroundColor: '#DC2626' }}></div>
                                            <div className="color-details">
                                                <span className="color-name">Error</span>
                                                <span className="color-value">$error</span>
                                            </div>
                                        </div>
                                        <div className="color-item">
                                            <div className="color-swatch" style={{ backgroundColor: '#4CAF50' }}></div>
                                            <div className="color-details">
                                                <span className="color-name">Success</span>
                                                <span className="color-value">$success</span>
                                            </div>
                                        </div>
                                        <div className="color-item">
                                            <div className="color-swatch" style={{ backgroundColor: '#1C1C1C' }}></div>
                                            <div className="color-details">
                                                <span className="color-name">Text Primary</span>
                                                <span className="color-value">$text-color</span>
                                            </div>
                                        </div>
                                        <div className="color-item">
                                            <div className="color-swatch" style={{ backgroundColor: '#6E6E6E' }}></div>
                                            <div className="color-details">
                                                <span className="color-name">Text Muted</span>
                                                <span className="color-value">$text-muted</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Typography */}
                            <div className="component-subsection">
                                <h3>Typography</h3>
                                <p>Font sizes, weights, and text styles used in the application</p>

                                <div className="typography-section">
                                    <h4>Headings</h4>
                                    <div className="typography-examples">
                                        <div className="typography-item">
                                            <div className="typography-sample title-large">Title Large</div>
                                            <div className="typography-details">
                                                <span>.title-large</span>
                                                <span>48px / 600 / 120%</span>
                                            </div>
                                        </div>
                                        <div className="typography-item">
                                            <div className="typography-sample title-medium">Title Medium</div>
                                            <div className="typography-details">
                                                <span>.title-medium</span>
                                                <span>40px / 600 / 120%</span>
                                            </div>
                                        </div>
                                        <div className="typography-item">
                                            <div className="typography-sample title-small">Title Small</div>
                                            <div className="typography-details">
                                                <span>.title-small</span>
                                                <span>32px / 500 / 120%</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="typography-section">
                                    <h4>Body Text</h4>
                                    <div className="typography-examples">
                                        <div className="typography-item">
                                            <div className="typography-sample body-large">Body Large</div>
                                            <div className="typography-details">
                                                <span>.body-large</span>
                                                <span>24px / 400 / 150%</span>
                                            </div>
                                        </div>
                                        <div className="typography-item">
                                            <div className="typography-sample body-medium">Body Medium</div>
                                            <div className="typography-details">
                                                <span>.body-medium</span>
                                                <span>20px / 400 / 150%</span>
                                            </div>
                                        </div>
                                        <div className="typography-item">
                                            <div className="typography-sample body-small">Body Small</div>
                                            <div className="typography-details">
                                                <span>.body-small</span>
                                                <span>16px / 300 / 150%</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Spacing */}
                            <div className="component-subsection">
                                <h3>Spacing</h3>
                                <p>Standard spacing units used throughout the application</p>

                                <div className="spacing-section">
                                    <div className="spacing-examples">
                                        <div className="spacing-item">
                                            <div className="spacing-sample" style={{width: '4px', height: '4px'}}></div>
                                            <div className="spacing-details">
                                                <span>4px</span>
                                                <span>Extra Small</span>
                                            </div>
                                        </div>
                                        <div className="spacing-item">
                                            <div className="spacing-sample" style={{width: '8px', height: '8px'}}></div>
                                            <div className="spacing-details">
                                                <span>8px</span>
                                                <span>Small</span>
                                            </div>
                                        </div>
                                        <div className="spacing-item">
                                            <div className="spacing-sample" style={{width: '16px', height: '16px'}}></div>
                                            <div className="spacing-details">
                                                <span>16px</span>
                                                <span>Medium</span>
                                            </div>
                                        </div>
                                        <div className="spacing-item">
                                            <div className="spacing-sample" style={{width: '24px', height: '24px'}}></div>
                                            <div className="spacing-details">
                                                <span>24px</span>
                                                <span>Large</span>
                                            </div>
                                        </div>
                                        <div className="spacing-item">
                                            <div className="spacing-sample" style={{width: '32px', height: '32px'}}></div>
                                            <div className="spacing-details">
                                                <span>32px</span>
                                                <span>Extra Large</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Shadows */}
                            <div className="component-subsection">
                                <h3>Shadows</h3>
                                <p>Shadow styles used for elevation in the UI</p>

                                <div className="shadows-section">
                                    <div className="shadows-examples">
                                        <div className="shadow-item">
                                            <div className="shadow-sample shadow-sm"></div>
                                            <div className="shadow-details">
                                                <span>Shadow Small</span>
                                                <span>$shadow-sm</span>
                                            </div>
                                        </div>
                                        <div className="shadow-item">
                                            <div className="shadow-sample shadow-md"></div>
                                            <div className="shadow-details">
                                                <span>Shadow Medium</span>
                                                <span>$shadow-md</span>
                                            </div>
                                        </div>
                                        <div className="shadow-item">
                                            <div className="shadow-sample shadow-lg"></div>
                                            <div className="shadow-details">
                                                <span>Shadow Large</span>
                                                <span>$shadow-lg</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Common Components */}
                        <section className="component-section" id="common-components">
                            <h2>Common Components</h2>
                            <p>Reusable components used throughout the application</p>

                            {/* Buttons */}
                            <div className="component-subsection">
                                <h3>Buttons</h3>
                                <div className="component-examples">
                                    <div className="example">
                                        <h4>Primary Buttons</h4>
                                        <div className="example-content">
                                            <Button
                                                name="Primary Button"
                                                theme="primary"
                                            />
                                            <Button
                                                name="With Icon"
                                                theme="primary"
                                                icon={<DownloadSimple weight="duotone" />}
                                            />
                                            <Button
                                                name="Icon Right"
                                                theme="primary"
                                                icon={<CaretRight weight="bold" />}
                                                iconPosition="right"
                                            />
                                        </div>
                                    </div>

                                    <div className="example">
                                        <h4>Secondary Buttons</h4>
                                        <div className="example-content">
                                            <Button
                                                name="Secondary Button"
                                                theme="secondary"
                                            />
                                            <Button
                                                name="With Icon"
                                                theme="secondary"
                                                icon={<DownloadSimple weight="duotone" />}
                                            />
                                            <Button
                                                name="Icon Right"
                                                theme="secondary"
                                                icon={<CaretRight weight="bold" />}
                                                iconPosition="right"
                                            />
                                        </div>
                                    </div>

                                    <div className="example">
                                        <h4>Button Sizes</h4>
                                        <div className="example-content">
                                            <Button
                                                name="Small"
                                                theme="primary"
                                                size="small"
                                            />
                                            <Button
                                                name="Medium (Default)"
                                                theme="primary"
                                            />
                                            <Button
                                                name="Large"
                                                theme="primary"
                                                size="large"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Badges */}
                            <div className="component-subsection">
                                <h3>Badges</h3>
                                <div className="component-examples">
                                    <div className="example">
                                        <h4>Status Badges</h4>
                                        <div className="example-content">
                                            <div className="badge badge-primary">New</div>
                                            <div className="badge badge-secondary">Bestseller</div>
                                            <div className="badge badge-success">In Stock</div>
                                            <div className="badge badge-warning">Low Stock</div>
                                            <div className="badge badge-danger">Out of Stock</div>
                                            <div className="badge badge-info">Coming Soon</div>
                                        </div>
                                    </div>

                                    <div className="example">
                                        <h4>Discount Badges</h4>
                                        <div className="example-content">
                                            <div className="badge badge-discount">-15%</div>
                                            <div className="badge badge-discount">-25%</div>
                                            <div className="badge badge-discount">-50%</div>
                                        </div>
                                    </div>

                                    <div className="example">
                                        <h4>Product Badges</h4>
                                        <div className="example-content">
                                            <div className="product-badge new">New</div>
                                            <div className="product-badge bestseller">Bestseller</div>
                                            <div className="product-badge discount">-20%</div>
                                            <div className="product-badge organic">Organic</div>
                                            <div className="product-badge premium">Premium</div>
                                        </div>
                                    </div>

                                    <div className="example">
                                        <h4>Category Tags</h4>
                                        <div className="example-content">
                                            <div className="category-tag">Olive Oil</div>
                                            <div className="category-tag">Argan Oil</div>
                                            <div className="category-tag">Organic</div>
                                            <div className="category-tag">Premium</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Cards */}
                            <div className="component-subsection">
                                <h3>Cards</h3>
                                <div className="component-examples">
                                    <div className="example">
                                        <h4>Basic Card</h4>
                                        <div className="example-content">
                                            <div className="card">
                                                <div className="card-body">
                                                    <h5 className="card-title">Card Title</h5>
                                                    <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="example">
                                        <h4>Card with Image</h4>
                                        <div className="example-content">
                                            <div className="card">
                                                <div className="card-image">
                                                    <img src="https://images.unsplash.com/photo-1519162808019-7de1683fa2ad?q=80&w=300" alt="Card example" />
                                                </div>
                                                <div className="card-body">
                                                    <h5 className="card-title">Card with Image</h5>
                                                    <p className="card-text">Some quick example text for a card with an image.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="example">
                                        <h4>Product Card</h4>
                                        <div className="example-content">
                                            <div className="product-card" style={{width: '300px'}}>
                                                <div className="product-image-container">
                                                    <img src="https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=300" alt="Product example" />
                                                    <div className="product-badge discount">-20%</div>
                                                    <button className="favorite-button">
                                                        <Heart size={20} />
                                                    </button>
                                                </div>
                                                <div className="product-info">
                                                    <div className="product-category">Olive Oil</div>
                                                    <h3 className="product-name">Premium Extra Virgin Olive Oil</h3>
                                                    <div className="product-rating">
                                                        <Star weight="fill" size={16} />
                                                        <span>4.8 (124)</span>
                                                    </div>
                                                    <div className="product-price">
                                                        <span className="old-price">$199.00</span>
                                                        <span className="current-price">$149.00</span>
                                                    </div>
                                                    <button className="product-button">
                                                        <ShoppingCart size={18} />
                                                        Add to Cart
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="example">
                                        <h4>Benefit Card</h4>
                                        <div className="example-content">
                                            <div className="benefit-card">
                                                <div className="benefit-icon">
                                                    <Medal size={32} weight="duotone" />
                                                </div>
                                                <div className="benefit-content">
                                                    <h3 className="benefit-title">Premium Quality</h3>
                                                    <p className="benefit-description">Our products are carefully selected for superior quality.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="example">
                                        <h4>Review Card</h4>
                                        <div className="example-content">
                                            <div className="card-review">
                                                <div className="review-header">
                                                    <div className="reviewer-info">
                                                        <div className="reviewer-avatar"></div>
                                                        <div className="reviewer-details">
                                                            <h4>Sarah Johnson</h4>
                                                            <div className="review-rating">
                                                                <Star weight="fill" size={16} />
                                                                <Star weight="fill" size={16} />
                                                                <Star weight="fill" size={16} />
                                                                <Star weight="fill" size={16} />
                                                                <Star weight="fill" size={16} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="verified-badge">
                                                        <CheckCircle size={16} weight="fill" />
                                                        Verified
                                                    </div>
                                                </div>
                                                <div className="review-content">
                                                    <p>"Absolutely love the quality of this olive oil. It has transformed my cooking!"</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section Header */}
                            <div className="component-subsection">
                                <h3>Section Header</h3>
                                <div className="component-examples">
                                    <div className="example full-width">
                                        <h4>Light Variant</h4>
                                        <div className="example-content">
                                            <SectionHeader
                                                icon={Buildings}
                                                title="Section Title"
                                                subtitle="This is a descriptive subtitle for the section"
                                                variant="light"
                                            />
                                        </div>
                                    </div>

                                    <div className="example full-width">
                                        <h4>Dark Variant</h4>
                                        <div className="example-content dark-bg">
                                            <SectionHeader
                                                icon={Medal}
                                                title="Section Title"
                                                subtitle="This is a descriptive subtitle for the section"
                                                variant="dark"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Form Fields */}
                            <div className="component-subsection">
                                <h3>Form Fields</h3>
                                <div className="component-examples">
                                    <div className="example">
                                        <h4>Basic Input Fields</h4>
                                        <div className="example-content">
                                            <Field
                                                inputName="name"
                                                Icon={<User size={20} weight="duotone" />}
                                                placeholder="Name"
                                                type="text"
                                            />
                                            <Field
                                                inputName="email"
                                                Icon={<At size={20} weight="duotone" />}
                                                placeholder="Email"
                                                type="email"
                                            />
                                            <Field
                                                inputName="phone"
                                                Icon={<Phone size={20} weight="duotone" />}
                                                placeholder="Phone Number"
                                                type="tel"
                                            />
                                        </div>
                                    </div>

                                    <div className="example">
                                        <h4>Message Field</h4>
                                        <div className="example-content">
                                            <MessageField
                                                inputName="message"
                                                placeholder="Your Message"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* TranslatedText */}
                            <div className="component-subsection">
                                <h3>Translated Text Components</h3>
                                <div className="component-examples">
                                    <div className="example">
                                        <h4>Basic Text Translation</h4>
                                        <div className="example-content">
                                            <div className="code-example">
                                                <code>
                                                    {'<TranslatedText path="common.buttons.submit" />'}
                                                </code>
                                            </div>
                                            <div className="result">
                                                <span>Result: </span>
                                                <TranslatedText path="common.buttons.submit" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="example">
                                        <h4>Translated Headings</h4>
                                        <div className="example-content">
                                            <div className="code-example">
                                                <code>
                                                    {'<TranslatedHeading level={2} path="blog.title" />'}
                                                </code>
                                            </div>
                                            <div className="result">
                                                <span>Result: </span>
                                                <TranslatedHeading level={2} path="blog.title" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Hero Section Components */}
                        <section className="component-section" id="hero-section">
                            <h2>Hero Section</h2>
                            <p>Components used in the hero section of the home page</p>

                            <div className="component-subsection">
                                <h3>Hero CTA Button</h3>
                                <div className="component-examples">
                                    <div className="example">
                                        <h4>CTA Hero Button</h4>
                                        <div className="example-content">
                                            <Button
                                                icon={<ArrowDownRight size={24} weight="duotone" />}
                                                name="Télécharger le catalogue"
                                                theme="cta-hero"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="component-subsection">
                                <h3>Product Card</h3>
                                <div className="component-examples">
                                    <div className="example full-width">
                                        <h4>Product Card with Variants</h4>
                                        <div className="example-content">
                                            {carouselProducts.length > 0 && (
                                                <ProductCard
                                                    product={carouselProducts[0]}
                                                    activeVariant={activeVariants[carouselProducts[0].id]}
                                                    onVariantChange={(variant) => setActiveVariants(prev => ({
                                                        ...prev,
                                                        [carouselProducts[0].id]: variant
                                                    }))}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="component-subsection">
                                <h3>Hero Carousel</h3>
                                <div className="component-examples">
                                    <div className="example full-width">
                                        <h4>Product Carousel</h4>
                                        <div className="example-content">
                                            <Carousel
                                                opts={{
                                                    loop: true,
                                                    align: 'center',
                                                    slidesToShow: 2,
                                                    containScroll: 'trimSnaps'
                                                }}
                                            >
                                                {carouselProducts.map((product) => (
                                                    <CarouselSlide key={product.id}>
                                                        <ProductCard
                                                            product={product}
                                                            activeVariant={activeVariants[product.id]}
                                                            onVariantChange={(variant) => setActiveVariants(prev => ({
                                                                ...prev,
                                                                [product.id]: variant
                                                            }))}
                                                        />
                                                    </CarouselSlide>
                                                ))}
                                            </Carousel>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Brands Section Components */}
                        <section className="component-section" id="brands-section">
                            <h2>Brands Section</h2>
                            <p>Components used in the brands section of the home page</p>

                            <div className="component-subsection">
                                <h3>Brand Cards</h3>
                                <div className="component-examples">
                                    <div className="example full-width">
                                        <h4>Brand Cards Grid</h4>
                                        <div className="example-content">
                                            <div className="brands-grid-example">
                                                {brandsData.slice(0, 3).map((brand) => (
                                                    <div key={brand.id} className="brand-card-example">
                                                        <div className="brand-image">
                                                            <img
                                                                src={brand.image}
                                                                alt={`Logo ${brand.title}`}
                                                                draggable="false"
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Benefits Section Components */}
                        <section className="component-section" id="benefits-section">
                            <h2>Benefits Section</h2>
                            <p>Components used in the benefits section of the home page</p>

                            <div className="component-subsection">
                                <h3>Benefit Cards</h3>
                                <div className="component-examples">
                                    <div className="example full-width">
                                        <h4>Benefit Cards Grid</h4>
                                        <div className="example-content">
                                            <div className="benefits-grid-example">
                                                {benefitsData.slice(0, 3).map((benefit) => (
                                                    <BenefitCard
                                                        key={benefit.id}
                                                        Icon={benefit.Icon}
                                                        title={benefit.title}
                                                        descp={benefit.descp}
                                                        ariaLabel={benefit.ariaLabel}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Reviews Section Components */}
                        <section className="component-section" id="reviews-section">
                            <h2>Reviews Section</h2>
                            <p>Components used in the reviews section of the home page</p>

                            <div className="component-subsection">
                                <h3>Review Cards</h3>
                                <div className="component-examples">
                                    <div className="example">
                                        <h4>Single Review Card</h4>
                                        <div className="example-content">
                                            {reviewsData.length > 0 && (
                                                <CardReview review={reviewsData[0]} />
                                            )}
                                        </div>
                                    </div>

                                    <div className="example full-width">
                                        <h4>Reviews Carousel</h4>
                                        <div className="example-content">
                                            <Carousel
                                                opts={{
                                                    loop: true,
                                                    align: 'center',
                                                    slidesToShow: 2,
                                                    containScroll: 'trimSnaps'
                                                }}
                                            >
                                                {reviewsData.slice(0, 4).map((review, index) => (
                                                    <CarouselSlide key={`${review.id}-${index}`}>
                                                        <CardReview review={review} />
                                                    </CarouselSlide>
                                                ))}
                                            </Carousel>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* FAQ Section Components */}
                        <section className="component-section" id="faq-section">
                            <h2>FAQ Section</h2>
                            <p>Components used in the FAQ section of the home page</p>

                            <div className="component-subsection">
                                <h3>Accordion</h3>
                                <div className="component-examples">
                                    <div className="example full-width">
                                        <h4>FAQ Accordion</h4>
                                        <div className="example-content">
                                            <Accordion items={faqItems} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* BlogHero Component from previous work */}
                        <section className="component-section" id="blogHero">
                            <h2>Blog Hero Component</h2>
                            <p>Hero section used on the blog pages</p>

                            <div className="component-examples">
                                <div className="example full-width">
                                    <h3>Blog Hero Example</h3>
                                    <div className="example-content">
                                        <div className="blog-hero-mock">
                                            <div className="hero-background">
                                                <div className="gradient-overlay"></div>
                                                <img
                                                    src={mockBlogPost.data.image}
                                                    alt=""
                                                    className="background-image"
                                                />
                                            </div>

                                            <div className="hero-content">
                                                <div className="intro-text">
                                                    <h1>
                                                        <span className="highlight">
                                                            <TranslatedText path="blog.hero.title" />
                                                        </span>
                                                        <br />
                                                        <TranslatedText path="blog.hero.tagline" />
                                                    </h1>
                                                    <TranslatedParagraph path="blog.hero.description" />
                                                </div>

                                                <div className="featured-article">
                                                    <div className="article-meta">
                                                        <span className="featured-label">
                                                            <TranslatedText path="blog.hero.featured" />
                                                        </span>
                                                        <span className="category">{mockBlogPost.data.category}</span>
                                                    </div>

                                                    <h2>{mockBlogPost.data.title}</h2>
                                                    <p>{mockBlogPost.data.excerpt}</p>

                                                    <div className="article-footer">
                                                        <div className="meta-info">
                                                            <span>
                                                                <Calendar weight="duotone" />
                                                                {new Date(mockBlogPost.metadata.publishedAt).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', {
                                                                    year: 'numeric',
                                                                    month: 'long',
                                                                    day: 'numeric'
                                                                })}
                                                            </span>
                                                            <span>
                                                                <Clock weight="duotone" />
                                                                {mockBlogPost.data.readTime} <TranslatedText path="blog.readTime" />
                                                            </span>
                                                        </div>

                                                        <Button
                                                            theme="primary"
                                                            name={<TranslatedText path="blog.hero.readArticle" />}
                                                            icon={<ArrowRight weight="bold" />}
                                                            iconPosition="right"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Footer Section Preview */}
                        <section className="component-section" id="footer-section">
                            <h2>Footer Component</h2>
                            <p>The actual footer component used throughout the site</p>

                            <div className="component-examples">
                                <div className="example full-width">
                                    <h3>Footer</h3>
                                    <div className="example-content footer-example">
                                        <Footer />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* E-commerce Components */}
                        <section className="component-section" id="ecommerce-section">
                            <h2>E-commerce Components</h2>
                            <p>Components for the e-commerce shop extension</p>

                            {/* Product Card */}
                            <div className="component-subsection">
                                <h3>Product Cards</h3>
                                <div className="component-examples">
                                    <div className="example">
                                        <h4>Standard Product Card</h4>
                                        <div className="example-content">
                                            <div className="product-card-shop">
                                                {mockProducts[0] && (
                                                    <>
                                                        <div className="product-image-container">
                                                            <img src={mockProducts[0].image} alt={mockProducts[0].name} />
                                                            {mockProducts[0].discount && (
                                                                <span className="product-discount">-{mockProducts[0].discount}%</span>
                                                            )}
                                                            {mockProducts[0].isNew && (
                                                                <span className="product-tag new">Nouveau</span>
                                                            )}
                                                            <button className="favorite-button" aria-label="Ajouter aux favoris">
                                                                <Heart weight="light" size={20} />
                                                            </button>
                                                        </div>
                                                        <div className="product-info">
                                                            <div className="product-category">{mockProducts[0].category}</div>
                                                            <h3 className="product-name">{mockProducts[0].name}</h3>
                                                            <div className="product-rating">
                                                                <Star weight="fill" size={16} />
                                                                <span>{mockProducts[0].rating} ({mockProducts[0].reviewCount})</span>
                                                            </div>
                                                            <div className="product-price">
                                                                {mockProducts[0].oldPrice && (
                                                                    <span className="old-price">{mockProducts[0].oldPrice} Dh</span>
                                                                )}
                                                                <span className="current-price">{mockProducts[0].price} Dh</span>
                                                            </div>
                                                            <button className="add-to-cart-button">
                                                                <ShoppingBag size={18} weight="bold" />
                                                                Ajouter au panier
                                                            </button>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="example">
                                        <h4>Compact Product Card</h4>
                                        <div className="example-content">
                                            <div className="product-card-shop compact">
                                                {mockProducts[1] && (
                                                    <>
                                                        <div className="product-image-container">
                                                            <img src={mockProducts[1].image} alt={mockProducts[1].name} />
                                                            {mockProducts[1].isBestseller && (
                                                                <span className="product-tag bestseller">Populaire</span>
                                                            )}
                                                        </div>
                                                        <div className="product-info">
                                                            <h3 className="product-name">{mockProducts[1].name}</h3>
                                                            <div className="product-price">
                                                                <span className="current-price">{mockProducts[1].price} Dh</span>
                                                            </div>
                                                            <button className="quick-add-button">
                                                                <Plus size={16} weight="bold" />
                                                            </button>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Product Details */}
                            <div className="component-subsection">
                                <h3>Product Details</h3>
                                <div className="component-examples">
                                    <div className="example full-width">
                                        <h4>Product Details Page</h4>
                                        <div className="example-content">
                                            <div className="product-details">
                                                <div className="product-gallery">
                                                    <div className="main-image">
                                                        <img src={mockProducts[0].image} alt={mockProducts[0].name} />
                                                    </div>
                                                    <div className="thumbnails">
                                                        <div className="thumbnail active">
                                                            <img src={mockProducts[0].image} alt="Thumbnail 1" />
                                                        </div>
                                                        <div className="thumbnail">
                                                            <img src="https://images.unsplash.com/photo-1589927986089-35812388d1f4?q=80&w=100&auto=format&fit=crop" alt="Thumbnail 2" />
                                                        </div>
                                                        <div className="thumbnail">
                                                            <img src="https://images.unsplash.com/photo-1611764613685-c483cbceca1e?q=80&w=100&auto=format&fit=crop" alt="Thumbnail 3" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="product-info-detailed">
                                                    <div className="product-category">{mockProducts[0].category}</div>
                                                    <h2 className="product-title">{mockProducts[0].name}</h2>
                                                    <div className="product-rating">
                                                        <div className="stars">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star key={i} weight={i < Math.floor(mockProducts[0].rating) ? "fill" : "light"} size={18} />
                                                            ))}
                                                        </div>
                                                        <span className="rating-count">{mockProducts[0].rating} ({mockProducts[0].reviewCount} avis)</span>
                                                    </div>
                                                    <div className="product-price-container">
                                                        {mockProducts[0].oldPrice && (
                                                            <span className="old-price">{mockProducts[0].oldPrice} Dh</span>
                                                        )}
                                                        <span className="current-price">{mockProducts[0].price} Dh</span>
                                                        {mockProducts[0].discount && (
                                                            <span className="discount-badge">-{mockProducts[0].discount}%</span>
                                                        )}
                                                    </div>
                                                    <p className="product-description">
                                                        {mockProducts[0].description}
                                                    </p>
                                                    <div className="product-variants">
                                                        <h4>Taille</h4>
                                                        <div className="variant-options">
                                                            {mockProducts[0].variants.map((variant) => (
                                                                <button
                                                                    key={variant.id}
                                                                    className={`variant-option ${selectedVariant === variant.id ? 'active' : ''}`}
                                                                    onClick={() => setSelectedVariant(variant.id)}
                                                                >
                                                                    {variant.name}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className="product-actions">
                                                        <div className="quantity-selector">
                                                            <button
                                                                className="quantity-button"
                                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                                disabled={quantity <= 1}
                                                            >
                                                                <Minus weight="bold" size={16} />
                                                            </button>
                                                            <span className="quantity">{quantity}</span>
                                                            <button
                                                                className="quantity-button"
                                                                onClick={() => setQuantity(quantity + 1)}
                                                            >
                                                                <Plus weight="bold" size={16} />
                                                            </button>
                                                        </div>
                                                        <button className="add-to-cart-button fullwidth">
                                                            <ShoppingBag weight="bold" size={20} />
                                                            Ajouter au panier
                                                        </button>
                                                        <button
                                                            className={`favorite-button-large ${isFavorite ? 'active' : ''}`}
                                                            onClick={() => setIsFavorite(!isFavorite)}
                                                            aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                                                        >
                                                            <Heart weight={isFavorite ? "fill" : "light"} size={20} />
                                                        </button>
                                                        <button className="share-button" aria-label="Partager">
                                                            <Share weight="light" size={20} />
                                                        </button>
                                                    </div>
                                                    <div className="product-shipping-info">
                                                        <div className="info-item">
                                                            <CheckCircle weight="fill" size={18} />
                                                            <span>En stock</span>
                                                        </div>
                                                        <div className="info-item">
                                                            <CheckCircle weight="fill" size={18} />
                                                            <span>Livraison gratuite à partir de 500 Dh</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Shopping Cart */}
                            <div className="component-subsection">
                                <h3>Shopping Cart</h3>
                                <div className="component-examples">
                                    <div className="example">
                                        <h4>Cart Item</h4>
                                        <div className="example-content">
                                            <div className="cart-item">
                                                <div className="item-image">
                                                    <img src={mockProducts[0].image} alt={mockProducts[0].name} />
                                                </div>
                                                <div className="item-details">
                                                    <h4 className="item-name">{mockProducts[0].name}</h4>
                                                    <div className="item-variant">500ml</div>
                                                    <div className="item-price">{mockProducts[0].price} Dh</div>
                                                </div>
                                                <div className="item-quantity">
                                                    <button className="quantity-button small">
                                                        <Minus weight="bold" size={12} />
                                                    </button>
                                                    <span className="quantity">2</span>
                                                    <button className="quantity-button small">
                                                        <Plus weight="bold" size={12} />
                                                    </button>
                                                </div>
                                                <div className="item-subtotal">298 Dh</div>
                                                <button className="remove-item-button">
                                                    <X weight="bold" size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="example">
                                        <h4>Cart Summary</h4>
                                        <div className="example-content">
                                            <div className="cart-summary">
                                                <h3 className="summary-title">Récapitulatif</h3>
                                                <div className="summary-row">
                                                    <span>Sous-total</span>
                                                    <span>{mockOrderSummary.subtotal} Dh</span>
                                                </div>
                                                <div className="summary-row">
                                                    <span>Livraison</span>
                                                    <span>{mockOrderSummary.shipping === 0 ? 'Gratuite' : `${mockOrderSummary.shipping} Dh`}</span>
                                                </div>
                                                <div className="summary-row">
                                                    <span>Taxes (20%)</span>
                                                    <span>{mockOrderSummary.tax} Dh</span>
                                                </div>
                                                <div className="summary-total">
                                                    <span>Total</span>
                                                    <span>{mockOrderSummary.total} Dh</span>
                                                </div>
                                                <button className="checkout-button">
                                                    <CreditCard weight="bold" size={18} />
                                                    Passer à la caisse
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Shop Navigation */}
                            <div className="component-subsection">
                                <h3>Shop Navigation</h3>
                                <div className="component-examples">
                                    <div className="example full-width">
                                        <h4>Category Filters</h4>
                                        <div className="example-content">
                                            <div className="shop-filters">
                                                <div className="filter-section">
                                                    <h4 className="filter-title">Catégories</h4>
                                                    <div className="filter-options">
                                                        <label className="filter-option">
                                                            <input type="checkbox" defaultChecked />
                                                            <span>Huile d'Olive</span>
                                                            <span className="count">(12)</span>
                                                        </label>
                                                        <label className="filter-option">
                                                            <input type="checkbox" />
                                                            <span>Huile de Tournesol</span>
                                                            <span className="count">(8)</span>
                                                        </label>
                                                        <label className="filter-option">
                                                            <input type="checkbox" />
                                                            <span>Huile d'Argan</span>
                                                            <span className="count">(5)</span>
                                                        </label>
                                                        <label className="filter-option">
                                                            <input type="checkbox" />
                                                            <span>Coffrets Cadeaux</span>
                                                            <span className="count">(3)</span>
                                                        </label>
                                                    </div>
                                                </div>

                                                <div className="filter-section">
                                                    <h4 className="filter-title">Prix</h4>
                                                    <div className="price-slider">
                                                        <div className="price-range">
                                                            <div className="range-track">
                                                                <div className="range-fill"></div>
                                                                <div className="range-handle left"></div>
                                                                <div className="range-handle right"></div>
                                                            </div>
                                                        </div>
                                                        <div className="price-inputs">
                                                            <input type="number" defaultValue="0" min="0" placeholder="Min" />
                                                            <span>-</span>
                                                            <input type="number" defaultValue="500" min="0" placeholder="Max" />
                                                            <button className="apply-price">Appliquer</button>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="filter-section">
                                                    <h4 className="filter-title">Taille</h4>
                                                    <div className="filter-options">
                                                        <label className="filter-option">
                                                            <input type="checkbox" />
                                                            <span>250ml</span>
                                                        </label>
                                                        <label className="filter-option">
                                                            <input type="checkbox" defaultChecked />
                                                            <span>500ml</span>
                                                        </label>
                                                        <label className="filter-option">
                                                            <input type="checkbox" />
                                                            <span>1L</span>
                                                        </label>
                                                        <label className="filter-option">
                                                            <input type="checkbox" />
                                                            <span>2L</span>
                                                        </label>
                                                    </div>
                                                </div>

                                                <button className="clear-filters-button">
                                                    Réinitialiser les filtres
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </main>
                </div>
            </div>
        </>
    );
};

export default ComponentShowcase;
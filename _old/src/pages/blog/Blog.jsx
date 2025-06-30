import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  NewspaperClipping,
  MagnifyingGlass,
  ListBullets,
  Sliders,
  CheckSquare,
  ArrowCounterClockwise,
  Calendar,
  CaretDown,
  Hash,
  Clock,
  CaretRight,
  X,
  Envelope,
  PaperPlaneTilt,
  InstagramLogo,
  FacebookLogo,
  LinkedinLogo,
  CheckCircle,
  Warning,
  CircleNotch
} from "@phosphor-icons/react";
import { Link } from 'react-router-dom';
import './blog.scss';
import NavBar from '../../sections/shared/navbar/NavBar';
import BlogSkeleton from '../../components/skeletons/BlogSkeleton';

// Image paths using placeholder services that are guaranteed to work
const CATEGORIES = [
    { name: 'Tous les articles', count: 24 },
    { name: 'Production', count: 8 },
    { name: 'Santé & Bien-être', count: 6 },
    { name: 'Conseils & Astuces', count: 5 },
    { name: 'Actualités', count: 3 },
    { name: 'Recettes', count: 2 }
];

const FEATURED_ARTICLES = [
    {
        id: 1,
        title: "L'art millénaire de l'huile d'olive marocaine",
        excerpt: "Une tradition ancestrale qui perdure à travers les générations...",
        category: "Tradition",
        image: "https://picsum.photos/id/292/1920/1080",
        date: "2024-03-20",
        readTime: 8,
        featured: true
    },
    {
        id: 2,
        title: "5 bienfaits méconnus de l'huile d'argan",
        excerpt: "Découvrez les secrets de cet or liquide...",
        category: "Santé",
        image: "https://picsum.photos/id/175/1920/1080",
        date: "2024-03-18",
        readTime: 6
    },
    {
        id: 3,
        title: "Production durable: Notre engagement",
        excerpt: "Comment nous préservons l'environnement...",
        category: "Production",
        image: "https://picsum.photos/id/284/1920/1080",
        date: "2024-03-15",
        readTime: 5
    }
];

const ARTICLES = [
    {
        id: 1,
        title: "L'art ancestral de la récolte des olives",
        excerpt: "Découvrez les techniques traditionnelles de récolte des olives au Maroc, transmises de génération en génération...",
        category: "Tradition",
        image: "https://picsum.photos/id/306/800/600",
        date: "2024-03-15",
        readTime: 5,
        author: "Sarah Amrani"
    },
    {
        id: 2,
        title: "Les bienfaits de l'huile d'olive pour la santé",
        excerpt: "Une exploration des propriétés nutritionnelles et des avantages santé de l'huile d'olive extra vierge...",
        category: "Santé",
        image: "https://picsum.photos/id/1080/800/600",
        date: "2024-03-10",
        readTime: 8,
        author: "Dr. Mohammed Benali"
    },
    {
        id: 3,
        title: "Production durable: Notre engagement",
        excerpt: "Comment nous préservons l'environnement tout en maintenant une qualité exceptionnelle...",
        category: "Production",
        image: "https://picsum.photos/id/859/800/600",
        date: "2024-03-08",
        readTime: 6,
        author: "Karim Tazi"
    },
    {
        id: 4,
        title: "Recette: Tajine aux olives",
        excerpt: "Une recette traditionnelle marocaine revisitée avec nos olives sélectionnées...",
        category: "Recettes",
        image: "https://picsum.photos/id/429/800/600",
        date: "2024-03-05",
        readTime: 4,
        author: "Fatima Zahra"
    },
    {
        id: 5,
        title: "Le processus de pressage à froid",
        excerpt: "Tout savoir sur notre méthode d'extraction qui préserve toutes les qualités de l'huile...",
        category: "Production",
        image: "https://picsum.photos/id/493/800/600",
        date: "2024-03-03",
        readTime: 7,
        author: "Hassan El Amrani"
    },
    {
        id: 6,
        title: "Guide: Choisir son huile d'olive",
        excerpt: "Les critères essentiels pour sélectionner une huile d'olive de qualité...",
        category: "Conseils",
        image: "https://picsum.photos/id/614/800/600",
        date: "2024-03-01",
        readTime: 5,
        author: "Yasmine Alami"
    }
];

const RECENT_POSTS = [
    {
        id: 1,
        title: "La récolte des olives en 2024",
        imageUrl: "https://picsum.photos/id/824/300/200",
        timeAgo: "Il y a 2 jours"
    },
    {
        id: 2,
        title: "Les bienfaits de l'huile d'olive",
        imageUrl: "https://picsum.photos/id/1024/300/200",
        timeAgo: "Il y a 5 jours"
    },
    {
        id: 3,
        title: "Notre processus de production",
        imageUrl: "https://picsum.photos/id/513/300/200",
        timeAgo: "Il y a 1 semaine"
    }
];

// Newsletter Popup Component
const NewsletterPopup = ({ isOpen, onClose, onSubmit, isSubmitting, success, error }) => {
    if (!isOpen) return null;

    return (
        <div className="newsletter-popup-overlay">
            <div className="newsletter-popup">
                <button className="close-popup" onClick={onClose}>
                    <X size={24} />
                </button>
                <div className="newsletter-popup-content">
                    <h3>Restez informé</h3>
                    <p>Inscrivez-vous à notre newsletter pour recevoir nos derniers articles et actualités.</p>

                    <form onSubmit={onSubmit}>
                        <div className="newsletter-input">
                            <Envelope size={20} />
                            <input
                                type="email"
                                placeholder="Votre adresse email"
                                required
                                disabled={isSubmitting || success}
                            />
                            <button
                                type="submit"
                                className={`submit-btn ${isSubmitting ? 'submitting' : ''} ${success ? 'success' : ''}`}
                                disabled={isSubmitting || success}
                            >
                                {isSubmitting ? (
                                    <CircleNotch className="loading-icon" size={20} />
                                ) : success ? (
                                    <CheckCircle size={20} />
                                ) : (
                                    <PaperPlaneTilt size={20} />
                                )}
                            </button>
                        </div>

                        {success && (
                            <div className="success-message">
                                <CheckCircle size={20} />
                                Merci pour votre inscription!
                            </div>
                        )}

                        {error && (
                            <div className="error-message">
                                <Warning size={20} />
                                {error}
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

const Blog = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState('Tous les articles');
    const [searchQuery, setSearchQuery] = useState('');
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [isNewsletterSubmitting, setIsNewsletterSubmitting] = useState(false);
    const [newsletterSuccess, setNewsletterSuccess] = useState(false);
    const [newsletterError, setNewsletterError] = useState('');
    const [isNewsletterPopupOpen, setIsNewsletterPopupOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const ITEMS_PER_PAGE = 6;
    const TOTAL_PAGES = Math.ceil(ARTICLES.length / ITEMS_PER_PAGE);

    // Simulate loading data
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    const displayedArticles = ARTICLES.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handleSubmitNewsletter = (e) => {
        e.preventDefault();
        setIsNewsletterSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            setIsNewsletterSubmitting(false);
            setNewsletterSuccess(true);
            // Reset form
            e.target.reset();

            // Close popup after success (optional, can be removed if you want to keep it open)
            setTimeout(() => {
                setIsNewsletterPopupOpen(false);
                setNewsletterSuccess(false);
            }, 3000);
        }, 1500);
    };

    const openNewsletterPopup = () => {
        setIsNewsletterPopupOpen(true);
        setNewsletterSuccess(false);
        setNewsletterError('');
    };

    // Show skeleton loader while loading
    if (loading) {
        return (
            <>
                <NavBar />
                <BlogSkeleton postCount={ITEMS_PER_PAGE} />
            </>
        );
    }

    return (
        <div className="blog-page full-width">
            <Helmet>
                <title>Journal - DikaFood</title>
                <meta name="description" content="Découvrez l'art de l'huile d'olive et la gastronomie marocaine" />
            </Helmet>

            {/* Add NavBar */}
                <NavBar />

            <div className="blog-container">
                {/* Hero Image Section */}
                <div className="blog-hero">
                    <img
                        src="https://picsum.photos/id/326/1920/1080"
                        alt="Blog DikaFood"
                        className="hero-image"
                    />
                    <div className="hero-overlay">
                    <div className="container">
                        <div className="hero-content">
                                <h2>Journal DikaFood: Découvrez l'art de l'huile d'olive marocaine</h2>
                                <div className="cta-buttons">
                                    <Link to="/blog" className="hero-cta">
                                    <NewspaperClipping weight="duotone" />
                                        Tous les articles
                                    </Link>
                                    <button
                                        className="hero-cta-secondary"
                                        onClick={openNewsletterPopup}
                                    >
                                        <Envelope weight="duotone" />
                                        S'abonner à la newsletter
                                    </button>
                                </div>
                            </div>
                        </div>
                            </div>
                        </div>

                {/* Blog Content Layout */}
                <div className="blog-content">
                    {/* Sidebar */}
                    <div className={`blog-sidebar ${mobileFiltersOpen ? 'mobile-open' : ''}`}>
                        <div className="mobile-sidebar-header">
                            <h3>Options de filtrage</h3>
                            <button className="close-sidebar" onClick={() => setMobileFiltersOpen(false)}>
                                <X size={24} />
                            </button>
                        </div>
                        <div className="blog-filters">
                            <div className="filter-section">
                                <div className="filter-title">
                                    <div className="icon-container">
                                        <ListBullets weight="duotone" />
                                    </div>
                                    Catégories
                                </div>
                                <div className="filter-options">
                                    {CATEGORIES.map((category) => (
                                        <label
                                            key={category.name}
                                            className={`filter-option ${selectedCategory === category.name ? 'active' : ''}`}
                                        >
                                            <span className="chevron">&gt;</span>
                                            <input
                                                type="radio"
                                                name="category"
                                                checked={selectedCategory === category.name}
                                                onChange={() => setSelectedCategory(category.name)}
                                            />
                                            {category.name}
                                            <span className="count">{category.count}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div className="filter-section">
                                <div className="filter-title">
                                    <div className="icon-container">
                                        <Calendar weight="duotone" />
                                    </div>
                                    Date
                                </div>
                                <div className="filter-options">
                                    <label className="filter-option">
                                        <span className="chevron">&gt;</span>
                                        <input type="checkbox" name="date" />
                                        Ce mois-ci
                                    </label>
                                    <label className="filter-option">
                                        <span className="chevron">&gt;</span>
                                        <input type="checkbox" name="date" />
                                        Les 3 derniers mois
                                    </label>
                                    <label className="filter-option">
                                        <span className="chevron">&gt;</span>
                                        <input type="checkbox" name="date" />
                                        Cette année
                                    </label>
                                </div>
                            </div>
                            <div className="filter-section">
                                <div className="filter-title">
                                    <div className="icon-container">
                                        <Clock weight="duotone" />
                                    </div>
                                    Temps de lecture
                                    </div>
                                <div className="filter-options">
                                    <label className="filter-option">
                                        <span className="chevron">&gt;</span>
                                        <input type="checkbox" name="readTime" />
                                        Moins de 5 minutes
                                    </label>
                                    <label className="filter-option">
                                        <span className="chevron">&gt;</span>
                                        <input type="checkbox" name="readTime" />
                                        5-10 minutes
                                    </label>
                                    <label className="filter-option">
                                        <span className="chevron">&gt;</span>
                                        <input type="checkbox" name="readTime" />
                                        Plus de 10 minutes
                                    </label>
                                </div>
                            </div>
                            <button
                                className="clear-filters-button"
                                onClick={() => {
                                    setSelectedCategory('Tous les articles');
                                    setSearchQuery('');
                                }}
                            >
                                <ArrowCounterClockwise size={16} weight="duotone" />
                                Réinitialiser les filtres
                            </button>
                                    </div>
                                    </div>

                    {/* Main Content */}
                    <div className="blog-main">
                        <button
                            className="filter-toggle"
                            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                        >
                            <Sliders size={20} weight="duotone" />
                            Filtres
                        </button>

                        {/* Blog Controls (Search, Sort, etc.) */}
                        <div className="blog-controls">
                            <div className="blog-search">
                                <div className="search-icon-container">
                                    <MagnifyingGlass size={20} weight="duotone" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Rechercher des articles..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                {searchQuery && (
                                    <button
                                        className="clear-search"
                                        onClick={() => setSearchQuery('')}
                                    >
                                        <X size={16} />
                                    </button>
                                )}
                                            </div>
                                            </div>

                        {/* Featured Article */}
                        <div className="featured-article">
                            <div className="featured-image">
                                <img
                                    src={FEATURED_ARTICLES[0].image}
                                    alt={FEATURED_ARTICLES[0].title}
                                />
                                <div className="category-badge">{FEATURED_ARTICLES[0].category}</div>
                            </div>
                            <div className="featured-content">
                                <h2>{FEATURED_ARTICLES[0].title}</h2>
                                <p>{FEATURED_ARTICLES[0].excerpt}</p>
                                <div className="article-meta">
                                    <span>
                                        <Calendar size={18} weight="duotone" />
                                        {new Date(FEATURED_ARTICLES[0].date).toLocaleDateString('fr-FR', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                        })}
                                    </span>
                                    <span>
                                        <Clock size={18} weight="duotone" />
                                        {FEATURED_ARTICLES[0].readTime} min de lecture
                                    </span>
                                </div>
                                <Link to="/blog/article/1" className="read-more-btn">
                                    Lire l'article
                                    <CaretRight size={16} weight="duotone" />
                                </Link>
                            </div>
                        </div>

                        {/* Results Count */}
                        <div className="blog-results">
                            <div className="results-count">
                                <Hash size={18} weight="duotone" />
                                Affichage de <span>{displayedArticles.length}</span> articles sur <span>{ARTICLES.length}</span>
                            </div>

                            <div className="pagination-info">
                                <span className="page-indicator">
                                    Page <span className="current-page">{currentPage}</span> sur <span>{TOTAL_PAGES}</span>
                                </span>
                            </div>
                        </div>

                        {/* Articles Grid */}
                        <div className="articles-grid">
                            {displayedArticles.map((article) => (
                                <div className="article-card" key={article.id}>
                                    <div className="article-image">
                                        <img src={article.image} alt={article.title} />
                                        <div className="category-badge">{article.category}</div>
                                    </div>
                                    <div className="article-info">
                                        <h3 className="article-title">
                                            <Link to={`/blog/article/${article.id}`}>{article.title}</Link>
                                        </h3>
                                        <div className="article-meta">
                                            <span>
                                                <Calendar size={16} weight="duotone" />
                                                {new Date(article.date).toLocaleDateString('fr-FR', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric'
                                                })}
                                            </span>
                                            <span>
                                                <Clock size={16} weight="duotone" />
                                                {article.readTime} min de lecture
                                            </span>
                                        </div>
                                        <p className="article-excerpt">{article.excerpt}</p>
                                        <div className="article-actions">
                                            <Link to={`/blog/article/${article.id}`} className="read-article-btn">
                                                Lire l'article
                                                <CaretRight size={14} weight="duotone" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Load More Button */}
                        <div className="pagination-controls">
                            <button
                                className="load-more-btn"
                                onClick={() => {
                                    if (currentPage < TOTAL_PAGES) {
                                        setCurrentPage(prevPage => prevPage + 1);
                                    }
                                }}
                                disabled={currentPage >= TOTAL_PAGES}
                            >
                                <span>Voir plus d'articles</span>
                                <CaretDown size={16} weight="duotone" className="load-more-icon" />
                            </button>

                            <div className="page-numbers">
                                {Array.from({ length: TOTAL_PAGES }, (_, i) => (
                                    <button
                                        key={i + 1}
                                        className={`page-number ${currentPage === i + 1 ? 'active' : ''}`}
                                        onClick={() => setCurrentPage(i + 1)}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Newsletter Popup */}
            <NewsletterPopup
                isOpen={isNewsletterPopupOpen}
                onClose={() => setIsNewsletterPopupOpen(false)}
                onSubmit={handleSubmitNewsletter}
                isSubmitting={isNewsletterSubmitting}
                success={newsletterSuccess}
                error={newsletterError}
            />
        </div>
    );
};

export default Blog;
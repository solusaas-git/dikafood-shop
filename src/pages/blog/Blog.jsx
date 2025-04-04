import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { NewspaperClipping, Envelope, PaperPlaneTilt, MagnifyingGlass, Hash, Clock, CaretRight, InstagramLogo, FacebookLogo, LinkedinLogo, ListBullets, Newspaper, TagSimple, UsersThree, Plant, Drop, Cookie, Heart, CookingPot, Factory, CaretLeft, Calendar, Star, SortAscending, FunnelSimple } from "@phosphor-icons/react";
import NavBar from '../../sections/shared/navbar/NavBar';
import Button from '../../components/buttons/Button';
import './blog.scss';
import { Instagram } from '../../components/icons/social/Instagram';
import { Facebook } from '../../components/icons/social/Facebook';
import { LinkedIn } from '../../components/icons/social/LinkedIn';

const RECENT_POSTS = [
    {
        id: 1,
        title: "La récolte des olives en 2024",
        imageUrl: "https://picsum.photos/seed/olives1/160/160",
        timeAgo: "Il y a 2 jours"
    },
    {
        id: 2,
        title: "Les bienfaits de l'huile d'olive",
        imageUrl: "https://picsum.photos/seed/olives2/160/160",
        timeAgo: "Il y a 5 jours"
    },
    {
        id: 3,
        title: "Notre processus de production",
        imageUrl: "https://picsum.photos/seed/olives3/160/160",
        timeAgo: "Il y a 1 semaine"
    }
];

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
        image: "https://picsum.photos/seed/featured1/1200/600",
        date: "2024-03-20",
        readTime: 8,
        featured: true
    },
    {
        id: 2,
        title: "5 bienfaits méconnus de l'huile d'argan",
        excerpt: "Découvrez les secrets de cet or liquide...",
        category: "Santé",
        image: "https://picsum.photos/seed/featured2/600/400",
        date: "2024-03-18",
        readTime: 6
    },
    {
        id: 3,
        title: "Production durable: Notre engagement",
        excerpt: "Comment nous préservons l'environnement...",
        category: "Production",
        image: "https://picsum.photos/seed/featured3/600/400",
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
        image: "https://picsum.photos/seed/olives1/400/250",
        date: "2024-03-15",
        readTime: 5,
        author: "Sarah Amrani"
    },
    {
        id: 2,
        title: "Les bienfaits de l'huile d'olive pour la santé",
        excerpt: "Une exploration des propriétés nutritionnelles et des avantages santé de l'huile d'olive extra vierge...",
        category: "Santé",
        image: "https://picsum.photos/seed/olives2/400/250",
        date: "2024-03-10",
        readTime: 8,
        author: "Dr. Mohammed Benali"
    },
    {
        id: 3,
        title: "Production durable: Notre engagement",
        excerpt: "Comment nous préservons l'environnement tout en maintenant une qualité exceptionnelle...",
        category: "Production",
        image: "https://picsum.photos/seed/olives3/400/250",
        date: "2024-03-08",
        readTime: 6,
        author: "Karim Tazi"
    },
    {
        id: 4,
        title: "Recette: Tajine aux olives",
        excerpt: "Une recette traditionnelle marocaine revisitée avec nos olives sélectionnées...",
        category: "Recettes",
        image: "https://picsum.photos/seed/olives4/400/250",
        date: "2024-03-05",
        readTime: 4,
        author: "Fatima Zahra"
    },
    {
        id: 5,
        title: "Le processus de pressage à froid",
        excerpt: "Tout savoir sur notre méthode d'extraction qui préserve toutes les qualités de l'huile...",
        category: "Production",
        image: "https://picsum.photos/seed/olives5/400/250",
        date: "2024-03-03",
        readTime: 7,
        author: "Hassan El Amrani"
    },
    {
        id: 6,
        title: "Guide: Choisir son huile d'olive",
        excerpt: "Les critères essentiels pour sélectionner une huile d'olive de qualité...",
        category: "Conseils",
        image: "https://picsum.photos/seed/olives6/400/250",
        date: "2024-03-01",
        readTime: 5,
        author: "Yasmine Alami"
    }
];

const Blog = () => {
    const [scrolled, setScrolled] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 6;
    const TOTAL_PAGES = 5; // This would come from your API
    const [activeSlide, setActiveSlide] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const position = window.scrollY;
            setScrolled(Math.min(position / 1000, 1));
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const displayedArticles = ARTICLES.slice(
        (currentPage - 1) * ITEMS_PER_PAGE, 
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <>
            <Helmet>
                <title>Journal - DikaFood</title>
                <meta name="description" content="Découvrez l'art de l'huile d'olive et la gastronomie marocaine" />
            </Helmet>

            <div className="blog">
                <NavBar />
                
                <section className="blog-hero">
                    <div className="hero-image" />
                    <div className="container">
                        <div className="hero-content">
                            <div className="hero-text">
                                <span className="overline">
                                    <NewspaperClipping weight="duotone" />
                                    Notre Journal
                                </span>
                                <div className="title-container">
                                    <h1>
                                        L'Art de
                                        <br />
                                        <span className="highlight">l'Huile d'Olive</span>
                                    </h1>
                                </div>
                            </div>

                            <div className="newsletter-cta">
                                <div className="newsletter-header">
                                    <Envelope weight="duotone" />
                                    <h3>Restez Informé</h3>
                                    {/* <p>Recevez nos derniers articles et actualités directement dans votre boîte mail</p> */}
                                </div>
                                <div className="input-group">
                                    <input 
                                        type="email" 
                                        placeholder="Votre adresse email" 
                                        aria-label="Email subscription"
                                    />
                                    <Button
                                        theme="primary"
                                        name="S'abonner"
                                        icon={<PaperPlaneTilt weight="duotone" />}
                                        iconPosition="right"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="featured-carousel">
                    <div className="container">
                        <div className="section-header">
                            <div className="header-left">
                                <div className="icon-wrapper">
                                    <Star weight="duotone" />
                                </div>
                                <h2>Articles à la Une</h2>
                            </div>
                            <div className="carousel-controls">
                                <div className="indicators">
                                    {FEATURED_ARTICLES.map((_, index) => (
                                        <button
                                            key={index}
                                            className={`indicator ${index === activeSlide ? 'active' : ''}`}
                                            onClick={() => setActiveSlide(index)}
                                        />
                                    ))}
                                </div>
                                <div className="navigation">
                                    <Button
                                        theme="secondary"
                                        icon={<CaretLeft weight="duotone" />}
                                        onClick={() => setActiveSlide(prev => 
                                            prev === 0 ? FEATURED_ARTICLES.length - 1 : prev - 1
                                        )}
                                    />
                                    <Button
                                        theme="secondary"
                                        icon={<CaretRight weight="duotone" />}
                                        onClick={() => setActiveSlide(prev => 
                                            prev === FEATURED_ARTICLES.length - 1 ? 0 : prev + 1
                                        )}
                                    />
                                </div>
                            </div>
                        </div>

                        <div 
                            className="carousel-container"
                            onMouseDown={(e) => {
                                setIsDragging(true);
                                setStartX(e.pageX - e.currentTarget.offsetLeft);
                                setScrollLeft(e.currentTarget.scrollLeft);
                            }}
                            onMouseLeave={() => setIsDragging(false)}
                            onMouseUp={() => setIsDragging(false)}
                            onMouseMove={(e) => {
                                if (!isDragging) return;
                                e.preventDefault();
                                const x = e.pageX - e.currentTarget.offsetLeft;
                                const walk = (x - startX) * 2;
                                const newSlide = Math.round((-scrollLeft - walk) / e.currentTarget.offsetWidth);
                                setActiveSlide(Math.max(0, Math.min(newSlide, FEATURED_ARTICLES.length - 1)));
                            }}
                        >
                            <div 
                                className="carousel-track"
                                style={{ 
                                    transform: `translateX(-${activeSlide * 100}%)`,
                                    transition: isDragging ? 'none' : 'transform 0.3s ease'
                                }}
                            >
                                {FEATURED_ARTICLES.map((article, index) => (
                                    <article key={article.id} className="carousel-card">
                                        <div className="article-image">
                                            <img src={article.image} alt={article.title} />
                                        </div>
                                        <div className="article-content">
                                            <span className="category-tag">
                                                {article.category}
                                            </span>
                                            <h3>{article.title}</h3>
                                            <p>{article.excerpt}</p>
                                            <div className="article-meta">
                                                <span className="date">
                                                    <Calendar weight="duotone" />
                                                    {new Date(article.date).toLocaleDateString('fr-FR', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </span>
                                                <span className="read-time">
                                                    <Clock weight="duotone" />
                                                    {article.readTime} min de lecture
                                                </span>
                                            </div>
                                            <Button 
                                                theme="secondary"
                                                name="Lire l'article"
                                                icon={<CaretRight weight="duotone" />}
                                                iconPosition="right"
                                            />
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <main className="blog-content">
                    <div className="container">
                        <div className="articles-section">
                            <div className="articles-header">
                                <div className="section-header">
                                    <div className="icon-wrapper">
                                        <Newspaper weight="duotone" />
                                    </div>
                                    <h2>Articles Récents</h2>
                                </div>
                                <div className="filters">
                                    <Button 
                                        theme="secondary"
                                        name="Trier par"
                                        icon={<SortAscending weight="duotone" />}
                                        iconPosition="left"
                                        onClick={() => {/* Add sort logic */}}
                                    />
                                    <Button 
                                        theme="secondary"
                                        name="Filtrer"
                                        icon={<FunnelSimple weight="duotone" />}
                                        iconPosition="left"
                                        onClick={() => {/* Add filter logic */}}
                                    />
                                </div>
                            </div>

                            <div className="articles-grid">
                                {displayedArticles.map(article => (
                                    <article key={article.id} className="article-card">
                                        <div className="article-image">
                                            <img 
                                                src={article.image} 
                                                alt={article.title}
                                                loading="lazy"
                                            />
                                            <div className="category-tag">
                                                {article.category}
                                            </div>
                                        </div>
                                        <div className="article-content">
                                            <h3>{article.title}</h3>
                                            <p>{article.excerpt}</p>
                                            <div className="article-meta">
                                                <span className="date">
                                                    <Calendar weight="duotone" />
                                                    {new Date(article.date).toLocaleDateString('fr-FR', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </span>
                                                <span className="read-time">
                                                    <Clock weight="duotone" />
                                                    {article.readTime} min de lecture
                                                </span>
                                            </div>
                                            <Button 
                                                theme="secondary"
                                                name="Lire plus"
                                                icon={<CaretRight weight="duotone" />}
                                                iconPosition="right"
                                            />
                                        </div>
                                    </article>
                                ))}
                            </div>

                            <div className="pagination">
                                <Button 
                                    theme="secondary"
                                    name="Précédent"
                                    icon={<CaretLeft weight="duotone" />}
                                    iconPosition="left"
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                />
                                <div className="page-numbers">
                                    {Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1).map(page => (
                                        <button
                                            key={page}
                                            className={`page-number ${page === currentPage ? 'active' : ''}`}
                                            onClick={() => setCurrentPage(page)}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                </div>
                                <Button 
                                    theme="secondary"
                                    name="Suivant"
                                    icon={<CaretRight weight="duotone" />}
                                    iconPosition="right"
                                    disabled={currentPage === TOTAL_PAGES}
                                    onClick={() => setCurrentPage(prev => Math.min(TOTAL_PAGES, prev + 1))}
                                />
                            </div>
                        </div>

                        <aside className="blog-sidebar">
                            <div className="sidebar-section search">
                                <div className="section-header">
                                    <div className="icon-wrapper">
                                        <MagnifyingGlass weight="duotone" />
                                    </div>
                                    <div className="header-text">
                                        <h3>Rechercher</h3>
                                    </div>
                                </div>
                                <div className="search-input">
                                    <div className="search-icon">
                                        <MagnifyingGlass weight="duotone" />
                                    </div>
                                    <input 
                                        type="search" 
                                        placeholder="Rechercher un article..." 
                                        aria-label="Rechercher un article"
                                    />
                                </div>
                            </div>

                            <div className="sidebar-section categories">
                                <div className="section-header">
                                    <div className="icon-wrapper">
                                        <ListBullets weight="duotone" />
                                    </div>
                                    <div className="header-text">
                                        <h3>Catégories</h3>
                                    </div>
                                </div>
                                <ul className="categories-list">
                                    {CATEGORIES.map((category, index) => (
                                        <li key={index}>
                                            <button className="category-item">
                                                <CaretRight weight="bold" />
                                                <span className="name">{category.name}</span>
                                                <span className="count">{category.count}</span>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="sidebar-section recent-posts">
                                <div className="section-header">
                                    <div className="icon-wrapper">
                                        <Newspaper weight="duotone" />
                                    </div>
                                    <div className="header-text">
                                        <h3>Articles Récents</h3>
                                    </div>
                                </div>
                                <ul>
                                    {RECENT_POSTS.map((post) => (
                                        <li key={post.id}>
                                            <div className="post-image">
                                                <img 
                                                    src={post.imageUrl} 
                                                    alt={post.title}
                                                    loading="lazy"
                                                />
                                            </div>
                                            <div className="post-info">
                                                <h4>{post.title}</h4>
                                                <span>
                                                    <Clock weight="bold" />
                                                    {post.timeAgo}
                                                </span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="sidebar-section tags">
                                <div className="section-header">
                                    <div className="icon-wrapper">
                                        <TagSimple weight="duotone" />
                                    </div>
                                    <div className="header-text">
                                        <h3>Tags Populaires</h3>
                                    </div>
                                </div>
                                <div className="tags-cloud">
                                    <span className="tag">
                                        <Plant weight="duotone" />
                                        Bio
                                    </span>
                                    <span className="tag">
                                        <Drop weight="duotone" />
                                        Huile
                                    </span>
                                    <span className="tag">
                                        <Factory weight="duotone" />
                                        Production
                                    </span>
                                    <span className="tag">
                                        <Heart weight="duotone" />
                                        Santé
                                    </span>
                                    <span className="tag">
                                        <CookingPot weight="duotone" />
                                        Tradition
                                    </span>
                                </div>
                            </div>

                            <div className="sidebar-section social">
                                <div className="section-header">
                                    <div className="icon-wrapper">
                                        <UsersThree weight="duotone" />
                                    </div>
                                    <div className="header-text">
                                        <h3>Suivez-nous</h3>
                                    </div>
                                </div>
                                <div className="social-links">
                                    <a 
                                        href="#" 
                                        className="instagram"
                                        style={{ background: '#E4405F' }}
                                    >
                                        <Instagram />
                                    </a>
                                    <a 
                                        href="#" 
                                        className="facebook"
                                        style={{ background: '#1877F2' }}
                                    >
                                        <Facebook />
                                    </a>
                                    <a 
                                        href="#" 
                                        className="linkedin"
                                        style={{ background: '#0A66C2' }}
                                    >
                                        <LinkedIn />
                                    </a>
                                </div>
                            </div>
                        </aside>
                    </div>
                </main>
            </div>
        </>
    );
};

export default Blog; 
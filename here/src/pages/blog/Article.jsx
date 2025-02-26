import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, ArrowLeft } from "@phosphor-icons/react";
import Button from '../../components/buttons/Button';
import './article.scss';
import { Helmet } from 'react-helmet-async';
import { API_URL } from '../../utils/api';

const Article = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [article, setArticle] = useState(null);
    const [relatedArticles, setRelatedArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [readingProgress, setReadingProgress] = useState(0);

    useEffect(() => {
        fetchArticle();
    }, [id]);

    useEffect(() => {
        if (article) {
            fetchRelatedArticles();
        }
    }, [article]);

    useEffect(() => {
        const updateReadingProgress = () => {
            const element = document.documentElement;
            const scrollTop = element.scrollTop - element.clientTop;
            const scrollHeight = element.scrollHeight - element.clientHeight;
            const progress = (scrollTop / scrollHeight) * 100;
            setReadingProgress(progress);
        };

        window.addEventListener('scroll', updateReadingProgress);
        return () => window.removeEventListener('scroll', updateReadingProgress);
    }, []);

    useEffect(() => {
        const incrementViews = async () => {
            if (!article) return;
            
            try {
                await fetch(`${API_URL}/public/posts/${id}/views`, {
                    method: 'POST'
                });
            } catch (err) {
                console.error('Error incrementing views:', err);
            }
        };

        incrementViews();
    }, [article, id]);

    const fetchArticle = async () => {
        try {
            const response = await fetch(`${API_URL}/public/posts/${id}`);
            if (!response.ok) {
                throw new Error('Article not found');
            }
            const data = await response.json();
            setArticle(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchRelatedArticles = async () => {
        try {
            const response = await fetch(
                `${API_URL}/public/posts/related?category=${article.data.category}&exclude=${id}&limit=3`
            );
            if (!response.ok) throw new Error('Failed to fetch related articles');
            const data = await response.json();
            setRelatedArticles(data);
        } catch (err) {
            console.error('Error fetching related articles:', err);
        }
    };

    if (loading) return (
        <div className="article-page">
            <div className="container">
                <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>Chargement de l'article...</p>
                </div>
            </div>
        </div>
    );

    if (error) return (
        <div className="article-page">
            <div className="container">
                <div className="error-state">
                    <h2>Article non trouvé</h2>
                    <p>{error}</p>
                    <div className="error-actions">
                        <Button 
                            name="Retour au blog"
                            theme="secondary"
                            to="/blog"
                            Icon={ArrowLeft}
                        />
                        <Button 
                            name="Réessayer"
                            theme="primary"
                            onClick={() => {
                                setLoading(true);
                                setError(null);
                                fetchArticle();
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );

    if (!article) return null;

    const { title, content, author, image, category, readTime } = article.data;
    const publishDate = new Date(article.metadata.publishedAt).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <>
            <Helmet>
                <title>{title} | Dikafood Blog</title>
                <meta name="description" content={article.data.excerpt} />
                <meta property="og:title" content={title} />
                <meta property="og:description" content={article.data.excerpt} />
                <meta property="og:image" content={image.data.url} />
            </Helmet>

            <div className="article-page">
                <div className="progress-bar" style={{ width: `${readingProgress}%` }} />

                <article className="article">
                    <div className="container">
                        <header className="article-header">
                            <h1>{title}</h1>
                            <div className="article-meta">
                                <div className="meta-item">
                                    <Calendar size={20} weight="duotone" />
                                    {publishDate}
                                </div>
                                <div className="meta-item">
                                    <Clock size={20} weight="duotone" />
                                    {readTime}
                                </div>
                                <div className="meta-item">
                                    <User size={20} weight="duotone" />
                                    {`${author.data.firstName} ${author.data.lastName}`}
                                </div>
                            </div>
                        </header>

                        <div className="featured-image">
                            <img src={image.data.url} alt={title} />
                        </div>

                        <div className="content-wrapper">
                            <div 
                                className="article-text"
                                dangerouslySetInnerHTML={{ __html: content }}
                            />
                            
                            <div className="article-footer">
                                <Button 
                                    name="Retour au blog"
                                    theme="secondary"
                                    to="/blog"
                                    Icon={ArrowLeft}
                                />
                                
                                <div className="share-buttons">
                                    <button onClick={() => window.open(`https://twitter.com/intent/tweet?text=${title}&url=${window.location.href}`)}>
                                        Twitter
                                    </button>
                                    <button onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`)}>
                                        Facebook
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </article>

                {relatedArticles.length > 0 && (
                    <div className="related-articles">
                        <h3>Articles similaires</h3>
                        <div className="related-grid">
                            {relatedArticles.map(post => (
                                <article key={post._id} className="post-card">
                                    <Link to={`/blog/${post._id}`}>
                                        <div className="post-image">
                                            <img src={post.data.image.data.url} alt={post.data.title} />
                                            <span className="category">{post.data.category}</span>
                                        </div>
                                        <div className="post-content">
                                            <h2>{post.data.title}</h2>
                                            <p>{post.data.excerpt}</p>
                                        </div>
                                    </Link>
                                </article>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Article; 
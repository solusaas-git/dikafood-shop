import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Calendar, Clock, ArrowLeft } from "@phosphor-icons/react";
import { API_URL } from '../../utils/api';
import './article.scss';
import { Helmet } from 'react-helmet-async';
import ArticleSkeleton from '../../components/skeletons/ArticleSkeleton';
import { getImagePlaceholder } from '../../utils/images';

const Article = () => {
    const { id } = useParams();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchArticle();
    }, [id]);

    const fetchArticle = async () => {
        try {
            const response = await fetch(`${API_URL}/public/posts/${id}`);
            if (!response.ok) throw new Error('Article not found');
            const data = await response.json();
            setArticle(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getImageUrls = (article) => {
        if (!article?.data?.image?.urls) {
            return {
                medium: getImagePlaceholder('medium'),
                large: getImagePlaceholder('large')
            };
        }

        return {
            medium: `${API_URL}${article.data.image.urls.medium}`,
            large: `${API_URL}${article.data.image.urls.large}`
        };
    };

    if (loading) return <ArticleSkeleton />;
    if (error) return <div className="article-error">{error}</div>;
    if (!article) return null;

    return (
        <>
            <Helmet>
                <title>{article.data.title} | Dikafood Blog</title>
                <meta name="description" content={article.data.excerpt} />
                <meta property="og:title" content={article.data.title} />
                <meta property="og:description" content={article.data.excerpt} />
                {article.data.image && (
                    <meta property="og:image" content={getImageUrls(article).large} />
                )}
            </Helmet>

            <div className="article">
                <Link to="/blog" className="back-link">
                    <ArrowLeft size={20} />
                    Retour au blog
                </Link>

                <article className="article-content">
                    {article.data.image && (
                        <picture>
                            <source
                                media="(min-width: 1024px)"
                                srcSet={getImageUrls(article).large}
                            />
                            <img 
                                src={getImageUrls(article).medium}
                                alt={article.data.title}
                                className="article-image"
                                onError={(e) => {
                                    e.target.src = getImagePlaceholder('medium');
                                }}
                            />
                        </picture>
                    )}

                    <div className="article-header">
                        <span className="category">{article.data.category}</span>
                        <h1>{article.data.title}</h1>
                        
                        <div className="article-meta">
                            <span>
                                <Calendar size={16} />
                                {formatDate(article.metadata.publishedAt)}
                            </span>
                            <span>
                                <Clock size={16} />
                                {article.data.readTime}
                            </span>
                        </div>
                    </div>

                    <div 
                        className="article-text"
                        dangerouslySetInnerHTML={{ __html: article.data.content }}
                    />
                </article>
            </div>
        </>
    );
};

export default Article; 
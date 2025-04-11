import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Calendar, Clock, ArrowLeft } from "@phosphor-icons/react";
import './article.scss';
import { Helmet } from 'react-helmet-async';
import NavBar from '../../sections/shared/navbar/NavBar';
import Footer from '../../sections/shared/footer/Footer';
import { blogPosts } from '../../data/blog-posts';

const Article = () => {
    const { id } = useParams();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Find the article in our mock data by ID
        const foundArticle = blogPosts.find(post => post.id === id);

        if (foundArticle) {
            setArticle(foundArticle);
            setLoading(false);
        } else {
            setError('Article not found');
            setLoading(false);
        }
    }, [id]);

    if (loading) return (
        <>
            <NavBar />
            <div className="article loading">
                <div className="container">
                    <div className="loading-spinner">Loading...</div>
                </div>
            </div>
            <Footer />
        </>
    );

    if (error) return (
        <>
            <NavBar />
            <div className="article error">
                <div className="container">
                    <div className="article-error">
                        <h2>Error</h2>
                        <p>{error}</p>
                        <Link to="/blog" className="back-link">
                            <ArrowLeft size={20} />
                            Return to Blog
                        </Link>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );

    if (!article) return null;

    return (
        <>
            <Helmet>
                <title>{article.title} | Dikafood Blog</title>
                <meta name="description" content={article.excerpt} />
                <meta property="og:title" content={article.title} />
                <meta property="og:description" content={article.excerpt} />
                <meta property="og:image" content={article.image} />
            </Helmet>

            <NavBar />

            <div className="article">
                <div className="container">
                    <Link to="/blog" className="back-link">
                        <ArrowLeft size={20} />
                        Retour au blog
                    </Link>

                    <article className="article-content">
                        <div className="article-image-container">
                            <img
                                src={article.image}
                                alt={article.title}
                                className="article-image"
                            />
                        </div>

                        <div className="article-header">
                            <span className="category">{article.category}</span>
                            <h1>{article.title}</h1>

                            <div className="article-meta">
                                <span className="date">
                                    <Calendar size={16} />
                                    {article.date}
                                </span>
                                <span className="read-time">
                                    <Clock size={16} />
                                    {article.readTime} min de lecture
                                </span>
                                <span className="author">
                                    Par {article.author}
                                </span>
                            </div>
                        </div>

                        <div
                            className="article-text"
                            dangerouslySetInnerHTML={{ __html: article.content }}
                        />
                    </article>
                </div>
            </div>

            <Footer />
        </>
    );
};

export default Article;
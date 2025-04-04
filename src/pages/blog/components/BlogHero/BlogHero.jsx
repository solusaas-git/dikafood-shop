import React from 'react';
import { Calendar, Clock, ArrowRight } from "@phosphor-icons/react";
import Button from '../../../../components/buttons/Button';
import './blog-hero.scss';

const BlogHero = ({ post }) => {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (!post) return null;

    return (
        <section className="blog-hero">
            <div className="hero-background">
                <div className="gradient-overlay"></div>
                <img 
                    src={post.data.image} 
                    alt="" 
                    className="background-image"
                />
            </div>

            <div className="hero-content">
                <div className="intro-text">
                    <h1>
                        <span className="highlight">Découvrez</span>
                        <br />
                        Notre Blog Culinaire
                    </h1>
                    <p>Explorez les saveurs authentiques de la cuisine marocaine à travers nos articles et recettes.</p>
                </div>

                <div className="featured-article">
                    <div className="article-meta">
                        <span className="featured-label">À la une</span>
                        <span className="category">{post.data.category}</span>
                    </div>
                    
                    <h2>{post.data.title}</h2>
                    <p>{post.data.excerpt}</p>

                    <div className="article-footer">
                        <div className="meta-info">
                            <span>
                                <Calendar weight="duotone" />
                                {formatDate(post.metadata.publishedAt)}
                            </span>
                            <span>
                                <Clock weight="duotone" />
                                {post.data.readTime} min de lecture
                            </span>
                        </div>

                        <Button 
                            to={`/blog/${post._id}`}
                            theme="primary"
                            name="Lire l'article"
                            icon={<ArrowRight weight="bold" />}
                            iconPosition="right"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BlogHero; 
import React from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, Clock, User, ArrowLeft } from "@phosphor-icons/react";
import { blogPosts } from '../../data/blog-posts';
import Button from '../../components/buttons/Button';
import './article.scss';

const Article = () => {
    const { id } = useParams();
    const article = blogPosts.find(post => post.id === id);

    if (!article) {
        return (
            <div className="article-not-found">
                <h1>Article non trouvé</h1>
                <Button 
                    name="Retour au blog"
                    theme="primary"
                    to="/blog"
                    Icon={ArrowLeft}
                />
            </div>
        );
    }

    return (
        <div className="article-page">
            <div className="article-hero">
                <div className="container">
                    <div className="hero-content">
                        <span className="category">{article.category}</span>
                        <h1>{article.title}</h1>
                        
                        <div className="article-meta">
                            <div className="meta-item">
                                <Calendar size={20} weight="duotone" />
                                {article.date}
                            </div>
                            <div className="meta-item">
                                <Clock size={20} weight="duotone" />
                                {article.readTime}
                            </div>
                            <div className="meta-item author">
                                <User size={20} weight="duotone" />
                                {article.author}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <article className="article-content">
                <div className="container">
                    <div className="featured-image">
                        <img src={article.image} alt={article.title} />
                    </div>

                    <div className="content-wrapper">
                        <div className="article-text" dangerouslySetInnerHTML={{ __html: article.content }} />
                        
                        <div className="article-footer">
                            <Button 
                                name="Retour au blog"
                                theme="secondary"
                                to="/blog"
                                Icon={ArrowLeft}
                            />
                            
                            <div className="share-buttons">
                                {/* Add social share buttons here if needed */}
                            </div>
                        </div>
                    </div>
                </div>
            </article>
        </div>
    );
};

export default Article; 
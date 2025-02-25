import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Article, Calendar, Clock, User, ShoppingBag } from '@phosphor-icons/react';
import SectionHeader from '../../components/ui/section/SectionHeader';
import Button from '../../components/buttons/Button';
import { blogPosts } from '../../data/blog-posts';
import './blog.scss';

const Blog = () => {
    const navigate = useNavigate();

    const handleCardClick = (postId) => {
        navigate(`/blog/${postId}`);
    };

    return (
        <div className="blog-page">
            <section className="blog-hero">
                <div className="container">
                    <div className="hero-content">
                        <SectionHeader 
                            icon={Article}
                            title="Notre Blog"
                            subtitle="Découvrez nos articles sur l'huile d'olive, la santé et la gastronomie"
                            variant="light"
                        />
                        
                        <div className="hero-cta">
                            <Button
                                name="Découvrir nos produits"
                                theme="primary"
                                to="/#catalog"
                                Icon={ShoppingBag}
                            />
                        </div>
                    </div>
                    
                    <div className="blog-grid">
                        {blogPosts.map((post) => (
                            <article 
                                key={post.id} 
                                className="blog-card"
                                onClick={() => handleCardClick(post.id)}
                                style={{ cursor: 'pointer' }}
                            >
                                <div className="card-image">
                                    <img 
                                        src={post.image} 
                                        alt={post.title}
                                        loading="lazy"
                                    />
                                    <span className="category">{post.category}</span>
                                </div>
                                <div className="card-content">
                                    <div className="meta">
                                        <div className="date">
                                            <Calendar size={16} weight="duotone" />
                                            {post.date}
                                        </div>
                                        <div className="read-time">
                                            <Clock size={16} weight="duotone" />
                                            {post.readTime}
                                        </div>
                                    </div>
                                    <h2>{post.title}</h2>
                                    <p>{post.excerpt}</p>
                                    <div className="card-footer">
                                        <div className="author">
                                            <User size={16} weight="duotone" />
                                            {post.author}
                                        </div>
                                        <Button
                                            name="Lire la suite"
                                            theme="secondary"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleCardClick(post.id);
                                            }}
                                        />
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Blog; 
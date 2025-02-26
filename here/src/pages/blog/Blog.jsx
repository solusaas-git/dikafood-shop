import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, User } from "@phosphor-icons/react";
import Button from '../../components/buttons/Button';
import './blog.scss';
import { Helmet } from 'react-helmet-async';
import { API_URL } from '../../utils/api';

const Blog = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');

    useEffect(() => {
        fetchPosts();
        fetchCategories();
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await fetch(`${API_URL}/public/posts`);
            if (!response.ok) throw new Error('Failed to fetch posts');
            const data = await response.json();
            setPosts(data);
        } catch (err) {
            setError('Failed to load blog posts');
            console.error('Error fetching posts:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await fetch(`${API_URL}/public/categories`);
            if (!response.ok) throw new Error('Failed to fetch categories');
            const data = await response.json();
            setCategories(data);
        } catch (err) {
            console.error('Error fetching categories:', err);
        }
    };

    const filteredPosts = selectedCategory === 'all' 
        ? posts 
        : posts.filter(post => post?.data?.category === selectedCategory);

    // Helper function to safely get nested properties
    const getAuthorName = (post) => {
        const firstName = post?.data?.author?.data?.firstName || '';
        const lastName = post?.data?.author?.data?.lastName || '';
        return firstName || lastName ? `${firstName} ${lastName}`.trim() : 'Anonymous';
    };

    const formatDate = (dateString) => {
        try {
            return new Date(dateString).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (err) {
            return '';
        }
    };

    if (loading) return (
        <div className="blog-page">
            <div className="blog-hero">
                <div className="container">
                    <h1>Notre Blog</h1>
                    <p>Découvrez nos articles sur la gastronomie, la cuisine et les produits alimentaires.</p>
                </div>
            </div>
            <div className="blog-content">
                <div className="container">
                    <div className="loading-state">
                        <div className="loading-spinner"></div>
                        <p>Chargement des articles...</p>
                    </div>
                </div>
            </div>
        </div>
    );

    if (error) return (
        <div className="blog-page">
            <div className="blog-hero">
                <div className="container">
                    <h1>Notre Blog</h1>
                    <p>Découvrez nos articles sur la gastronomie, la cuisine et les produits alimentaires.</p>
                </div>
            </div>
            <div className="blog-content">
                <div className="container">
                    <div className="error-state">
                        <h2>Oops! Une erreur s'est produite</h2>
                        <p>{error}</p>
                        <Button 
                            name="Réessayer"
                            theme="primary"
                            onClick={() => {
                                setLoading(true);
                                setError(null);
                                fetchPosts();
                                fetchCategories();
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <Helmet>
                <title>Blog | Dikafood</title>
                <meta name="description" content="Découvrez nos articles sur la gastronomie, la cuisine et les produits alimentaires." />
            </Helmet>

            <div className="blog-page">
                <div className="blog-hero">
                    <div className="container">
                        <h1>Notre Blog</h1>
                        <p>Découvrez nos articles sur la gastronomie, la cuisine et les produits alimentaires.</p>
                    </div>
                </div>

                <div className="blog-content">
                    <div className="container">
                        {categories.length > 0 && (
                            <div className="categories-filter">
                                <Button 
                                    name="Tous"
                                    theme={selectedCategory === 'all' ? 'primary' : 'secondary'}
                                    onClick={() => setSelectedCategory('all')}
                                />
                                {categories.map(category => (
                                    <Button
                                        key={category}
                                        name={category}
                                        theme={selectedCategory === category ? 'primary' : 'secondary'}
                                        onClick={() => setSelectedCategory(category)}
                                    />
                                ))}
                            </div>
                        )}

                        <div className="posts-grid">
                            {filteredPosts.map(post => post && (
                                <article key={post._id} className="post-card">
                                    <Link to={`/blog/${post._id}`}>
                                        <div className="post-image">
                                            <img 
                                                src={post?.data?.image?.data?.url} 
                                                alt={post?.data?.title || 'Article image'} 
                                            />
                                            <span className="category">{post?.data?.category}</span>
                                        </div>
                                        <div className="post-content">
                                            <h2>{post?.data?.title}</h2>
                                            <p>{post?.data?.excerpt}</p>
                                            
                                            <div className="post-meta">
                                                <div className="meta-item">
                                                    <Calendar size={20} weight="duotone" />
                                                    {formatDate(post?.metadata?.publishedAt)}
                                                </div>
                                                <div className="meta-item">
                                                    <Clock size={20} weight="duotone" />
                                                    {post?.data?.readTime || '5 min'}
                                                </div>
                                                <div className="meta-item">
                                                    <User size={20} weight="duotone" />
                                                    {getAuthorName(post)}
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </article>
                            ))}
                        </div>

                        {filteredPosts.length === 0 && (
                            <div className="empty-state">
                                <h2>Aucun article disponible</h2>
                                <p>Revenez bientôt pour découvrir nos nouveaux articles!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Blog; 
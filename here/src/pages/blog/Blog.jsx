import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Plus, Article } from "@phosphor-icons/react";
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import BlogSkeleton from '../../components/skeletons/BlogSkeleton';
import SectionHeader from '../../components/ui/section/SectionHeader';
import BackToHome from '../../components/ui/navigation/BackToHome';
import Button from '../../components/buttons/Button';
import './blog.scss';

// Add base URL for API
axios.defaults.baseURL = 'http://localhost:1025';

const POSTS_PER_PAGE = 6; // Number of posts to load each time

// Helper to get a placeholder image
const getPlaceholderImage = (index) => {
    // Using placehold.co with custom colors and text
    const colors = [
        ['F9E4C8/435334', 'Cuisine'], // Light yellow/Green
        ['CEDEBD/435334', 'Recette'], // Light green/Dark green
        ['9EB384/FFF', 'Tradition'],   // Sage/White
        ['435334/FFF', 'DikaFood']     // Dark green/White
    ];
    
    // Cycle through colors based on index
    const [colorPair, text] = colors[index % colors.length];
    
    return `https://placehold.co/600x400/${colorPair}?text=${text}&font=montserrat`;
};

const Blog = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const fetchPosts = async (pageNum = 1) => {
        try {
            const response = await axios.get(`/public/blog/posts?page=${pageNum}&limit=${POSTS_PER_PAGE}`);
            
            // Handle array response directly
            if (Array.isArray(response.data)) {
                const postsWithImages = response.data.map((post, index) => ({
                    ...post,
                    data: {
                        ...post.data,
                        image: post.data.image || getPlaceholderImage(index)
                    }
                }));

                if (pageNum === 1) {
                    setPosts(postsWithImages);
                } else {
                    setPosts(prev => [...prev, ...postsWithImages]);
                }

                // Check if we have more posts to load
                setHasMore(postsWithImages.length === POSTS_PER_PAGE);
            } else {
                console.error('Expected array but got:', typeof response.data);
                setError('Invalid data format received');
            }
        } catch (err) {
            console.error('Error fetching blog posts:', err);
            setError('Failed to load blog posts');
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleLoadMore = async () => {
        setLoadingMore(true);
        const nextPage = page + 1;
        setPage(nextPage);
        await fetchPosts(nextPage);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) return <BlogSkeleton />;
    if (error) return <div className="blog-error">{error}</div>;
    if (!posts.length) {
        return <div className="blog-empty">Aucun article disponible</div>;
    }

    return (
        <>
            <Helmet>
                <title>Blog - DikaFood</title>
                <meta name="description" content="Découvrez nos articles sur la gastronomie marocaine" />
            </Helmet>

            <BackToHome />

            <div className="blog">
                <SectionHeader
                    icon={Article}
                    title="Notre Blog"
                    subtitle="Découvrez nos articles sur la gastronomie marocaine"
                    variant="light"
                />

                <div className="posts">
                    {posts.map((post, index) => (
                        <article key={post._id} className="post-card">
                            <Link to={`/blog/${post._id}`}>
                                <div className="post-image">
                                    <img 
                                        src={post.data.image}
                                        alt={post.data.title}
                                        loading="lazy"
                                        onError={(e) => {
                                            // Use a branded fallback image on error
                                            e.target.src = `https://placehold.co/600x400/F9E4C8/435334?text=DikaFood&font=montserrat`;
                                        }}
                                    />
                                </div>
                                <div className="post-content">
                                    <span 
                                        className="category"
                                        data-category={post.data.category}
                                    >
                                        {post.data.category}
                                    </span>
                                    <h2>{post.data.title}</h2>
                                    <p>{post.data.excerpt}</p>
                                    
                                    <div className="post-meta">
                                        <span aria-label="Date de publication">
                                            <Calendar weight="duotone" size={18} />
                                            {formatDate(post.metadata.publishedAt)}
                                        </span>
                                        <span aria-label="Temps de lecture">
                                            <Clock weight="duotone" size={18} />
                                            {post.data.readTime} min
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        </article>
                    ))}
                </div>

                {hasMore && (
                    <div className="load-more">
                        <Button
                            onClick={handleLoadMore}
                            disabled={loadingMore}
                            icon={<Plus weight="bold" size={20} />}
                            name={loadingMore ? 
                                <span className="loading-dots">Chargement...</span> : 
                                "Charger plus d'articles"
                            }
                            theme="light"
                            size="medium"
                            className="load-more-button"
                        />
                    </div>
                )}
            </div>
        </>
    );
};

export default Blog; 
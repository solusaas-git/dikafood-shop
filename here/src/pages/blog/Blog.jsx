import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import NavBar from '../../sections/shared/navbar/NavBar';
import BlogHero from './components/BlogHero/BlogHero';
import { API_URL } from '../../utils/api';
import './blog.scss';

const Blog = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [featuredPost, setFeaturedPost] = useState(null);

    useEffect(() => {
        const fetchFeaturedPost = async () => {
            try {
                const response = await fetch(`${API_URL}/public/blog/posts`);
                const data = await response.json();
                setFeaturedPost(data[0]); // Set first post as featured
            } catch (error) {
                console.error('Error fetching featured post:', error);
            }
        };

        fetchFeaturedPost();
    }, []);

    return (
        <>
            <Helmet>
                <title>Blog - DikaFood</title>
                <meta name="description" content="Découvrez nos articles sur la gastronomie marocaine" />
            </Helmet>

            <div className="blog-page">
                <NavBar 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    isOpen={isMenuOpen}
                    onClose={() => setIsMenuOpen(false)}
                />
                
                <BlogHero post={featuredPost} />
            </div>
        </>
    );
};

export default Blog; 
import React from 'react';
import { Calendar, Clock, ArrowRight } from "@phosphor-icons/react";
import Button from '../../../../components/buttons/Button';
import { TranslatedText, TranslatedHeading, TranslatedParagraph } from '../../../../components/ui/text/TranslatedText';
import { useLanguage } from '../../../../context/LanguageContext';
import './blog-hero.scss';

const BlogHero = ({ post }) => {
    const { language } = useLanguage();

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', {
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
                    alt={post.data.title}
                    className="background-image"
                />
            </div>

            <div className="hero-content">
                <div className="intro-text">
                    <h1>
                        <span className="highlight">
                            <TranslatedText path="blog.hero.title" />
                        </span>
                        <br />
                        <TranslatedText path="blog.hero.tagline" />
                    </h1>
                    <TranslatedParagraph path="blog.hero.description" />
                </div>

                <div className="featured-article">
                    <div className="article-meta">
                        <span className="featured-label">
                            <TranslatedText path="blog.hero.featured" />
                        </span>
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
                                {post.data.readTime} <TranslatedText path="blog.readTime" />
                            </span>
                        </div>

                        <Button
                            to={`/blog/${post._id}`}
                            theme="primary"
                            name={<TranslatedText path="blog.hero.readArticle" />}
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
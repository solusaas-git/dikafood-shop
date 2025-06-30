import React from 'react';
import './BlogSkeleton.scss';

/**
 * BlogSkeleton component for displaying loading state of blog pages
 *
 * @param {Object} props
 * @param {string} props.className - Optional additional CSS class
 * @param {boolean} props.withHero - Whether to include hero section (default: true)
 * @param {number} props.postCount - Number of skeleton posts to display (default: 6)
 * @returns {JSX.Element}
 */
const BlogSkeleton = ({ className = '', withHero = true, postCount = 6 }) => {
  return (
    <div className={`blog-skeleton ${className}`}>
      {/* Header Skeleton */}
      <div className="header-skeleton">
        <div className="logo-skeleton"></div>
        <div className="nav-skeleton"></div>
      </div>

      {/* Hero Section Skeleton (optional) */}
      {withHero && <div className="hero-skeleton"></div>}

      {/* Blog Content Skeleton */}
      <div className="blog-content-skeleton">
        {/* Main Content */}
        <div className="main-content-skeleton">
          <div className="filters-skeleton"></div>

          <div className="posts-grid-skeleton">
            {[...Array(postCount)].map((_, index) => (
              <div key={index} className="post-skeleton">
                <div className="image-skeleton"></div>
                <div className="content-skeleton">
                  <div className="category-skeleton"></div>
                  <div className="title-skeleton"></div>
                  <div className="excerpt-skeleton"></div>
                  <div className="excerpt-skeleton"></div>
                  <div className="meta-skeleton"></div>
                </div>
              </div>
            ))}
          </div>

          <div className="pagination-skeleton"></div>
        </div>

        {/* Sidebar */}
        <div className="sidebar-skeleton">
          {/* Search Widget */}
          <div className="sidebar-widget-skeleton">
            <div className="widget-title-skeleton"></div>
            <div className="search-skeleton"></div>
          </div>

          {/* Categories Widget */}
          <div className="sidebar-widget-skeleton">
            <div className="widget-title-skeleton"></div>
            <div className="categories-skeleton">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="category-item-skeleton"></div>
              ))}
            </div>
          </div>

          {/* Recent Posts Widget */}
          <div className="sidebar-widget-skeleton">
            <div className="widget-title-skeleton"></div>
            <div className="recent-posts-skeleton">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="recent-post-skeleton">
                  <div className="post-image-skeleton"></div>
                  <div className="post-info-skeleton">
                    <div className="post-title-skeleton"></div>
                    <div className="post-meta-skeleton"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * BlogPostSkeleton component for displaying loading state of a single blog post
 *
 * @param {Object} props
 * @param {string} props.className - Optional additional CSS class
 * @returns {JSX.Element}
 */
export const BlogPostSkeleton = ({ className = '' }) => {
  return (
    <div className={`blog-skeleton blog-post-skeleton ${className}`}>
      {/* Header Skeleton */}
      <div className="header-skeleton">
        <div className="logo-skeleton"></div>
        <div className="nav-skeleton"></div>
      </div>

      <div className="container">
        {/* Back Link Skeleton */}
        <div className="skeleton-element" style={{ height: '30px', width: '120px', marginBottom: '2rem' }}></div>

        {/* Article Content */}
        <div className="article-skeleton">
          {/* Image Skeleton */}
          <div className="skeleton-element" style={{
            height: '400px',
            width: '100%',
            marginBottom: '2rem',
            borderRadius: '15px'
          }}></div>

          {/* Header Skeleton */}
          <div className="article-header-skeleton">
            <div className="skeleton-element" style={{ height: '24px', width: '100px', marginBottom: '1rem' }}></div>
            <div className="skeleton-element" style={{ height: '60px', width: '100%', marginBottom: '1.5rem' }}></div>
            <div className="skeleton-element" style={{ height: '20px', width: '60%', marginBottom: '2rem' }}></div>
          </div>

          {/* Content Paragraphs Skeleton */}
          <div className="article-content-skeleton">
            {[...Array(6)].map((_, index) => (
              <React.Fragment key={index}>
                <div
                  className="skeleton-element"
                  style={{
                    height: '18px',
                    width: '100%',
                    marginBottom: '0.8rem',
                    animationDelay: `${index * 0.1}s`
                  }}
                ></div>
                <div
                  className="skeleton-element"
                  style={{
                    height: '18px',
                    width: '95%',
                    marginBottom: '0.8rem',
                    animationDelay: `${index * 0.1}s`
                  }}
                ></div>
                <div
                  className="skeleton-element"
                  style={{
                    height: '18px',
                    width: '98%',
                    marginBottom: '2rem',
                    animationDelay: `${index * 0.1}s`
                  }}
                ></div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogSkeleton;
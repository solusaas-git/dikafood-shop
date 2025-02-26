import React from 'react';
import './skeletons.scss';

const BlogSkeleton = () => {
    return (
        <div className="blog-skeleton">
            <div className="header-skeleton">
                <div className="title-skeleton"></div>
                <div className="subtitle-skeleton"></div>
            </div>
            
            <div className="posts-skeleton">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="post-card-skeleton">
                        <div className="image-skeleton"></div>
                        <div className="content-skeleton">
                            <div className="category-skeleton"></div>
                            <div className="title-skeleton"></div>
                            <div className="excerpt-skeleton">
                                <div className="line"></div>
                                <div className="line"></div>
                            </div>
                            <div className="meta-skeleton">
                                <div className="meta-item"></div>
                                <div className="meta-item"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BlogSkeleton; 
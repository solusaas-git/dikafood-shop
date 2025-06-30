import React from 'react';
import './skeletons.scss';

const ArticleSkeleton = () => {
    return (
        <div className="article-skeleton">
            <div className="back-link-skeleton"></div>
            
            <div className="content-skeleton">
                <div className="image-skeleton"></div>
                
                <div className="header-skeleton">
                    <div className="category-skeleton"></div>
                    <div className="title-skeleton"></div>
                    <div className="meta-skeleton">
                        <div className="meta-item"></div>
                        <div className="meta-item"></div>
                    </div>
                </div>
                
                <div className="text-skeleton">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="paragraph-skeleton">
                            <div className="line"></div>
                            <div className="line"></div>
                            <div className="line"></div>
                            <div className="line short"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ArticleSkeleton; 
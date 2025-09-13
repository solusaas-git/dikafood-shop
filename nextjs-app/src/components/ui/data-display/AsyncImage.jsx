import React, { useState, useEffect } from 'react';
import { getProductImageUrlById } from '@/services/api';

export default function AsyncImage({ imageId, alt, className, ...props }) {
  const [src, setSrc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;
    if (imageId) {
      setLoading(true);
      setError(false);
      getProductImageUrlById(imageId)
        .then(url => {
          if (mounted) {
            setSrc(url);
            setLoading(false);
          }
        })
        .catch(() => {
          if (mounted) {
            setError(true);
            setLoading(false);
            setSrc('/images/placeholder-product.png');
          }
        });
    } else {
      setSrc('/images/placeholder-product.png');
      setLoading(false);
    }
    return () => { mounted = false; };
  }, [imageId]);

  if (loading) {
    return (
      <div className={`bg-gray-100 w-full h-full flex items-center justify-center text-gray-400 ${className}`} {...props}>
        <div className="animate-pulse text-sm">Loading...</div>
      </div>
    );
  }

  if (error && !src) {
    return (
      <div className={`bg-gray-100 w-full h-full flex items-center justify-center text-gray-400 ${className}`} {...props}>
        <div className="text-sm">No Image</div>
      </div>
    );
  }

  return <img src={src} alt={alt} className={className} {...props} />;
} 
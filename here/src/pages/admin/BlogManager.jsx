import React, { useState } from 'react';
import Button from '../../components/buttons/Button';
import { API_URL } from '../../utils/api';

const BlogManager = () => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const createDummyPosts = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/blog/admin/dummy-posts`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            if (response.ok) {
                setMessage({ type: 'success', text: `Created ${data.data.count} posts successfully` });
            } else {
                setMessage({ type: 'error', text: data.error });
            }
        } catch (err) {
            setMessage({ type: 'error', text: err.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="blog-manager">
            <h1>Blog Manager</h1>
            
            {message && (
                <div className={`message ${message.type}`}>
                    {message.text}
                </div>
            )}
            
            <Button
                name="Create Dummy Posts"
                theme="primary"
                onClick={createDummyPosts}
                disabled={loading}
            />
        </div>
    );
};

export default BlogManager; 
import React, { useEffect, useState } from 'react';
import { Alert, Spinner, Button, Card } from 'react-bootstrap';
import axios from 'axios';
import { createTransformedUrl } from '../utils/imagekit';

function FeedPage({ apiBaseUrl, getHeaders }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchFeed = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/feed`, { headers: getHeaders() });
      setPosts(response.data.posts || []);
    } catch (err) {
      setError('Failed to load feed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  const handleDelete = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await axios.delete(`${apiBaseUrl}/posts/${postId}`, { headers: getHeaders() });
      setPosts(posts.filter(post => post.id !== postId));
    } catch (err) {
      alert('Failed to delete post!');
    }
  };

  if (loading) return <div className="text-center mt-5"><Spinner animation="border" /></div>;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (posts.length === 0) return <Alert variant="info">No posts yet! Be the first to share something.</Alert>;

  return (
    <div>
      <h2 className="mb-4">🏠 Feed</h2>
      {posts.map((post) => (
        <Card key={post.id} className="mb-4 shadow-sm" style={{ maxWidth: '600px' }}>
          <Card.Header className="d-flex justify-content-between align-items-center bg-white">
            <div>
              <strong>{post.email}</strong>
              <span className="text-muted small"> • {post.created_at?.substring(0, 10) || "Recent"}</span>
            </div>
            {post.is_owner && (
              <Button variant="link" className="text-danger p-0 m-0 text-decoration-none" onClick={() => handleDelete(post.id)} title="Delete post">
                🗑️
              </Button>
            )}
          </Card.Header>
          <Card.Body className="p-2 text-center bg-light">

            {post.file_type === 'image' ? (
              <div>
                <img
                  src={createTransformedUrl(post.url, "")}
                  alt="Post item"
                  style={{ width: '100%', maxWidth: '400px', height: 'auto' }}
                />
                {post.caption && <div className="text-muted mt-2 small">{post.caption}</div>}
              </div>
            ) : (

              <div>
                <video
                  src={createTransformedUrl(post.url, "w-400,h-200,cm-pad_resize,bg-blurred")}
                  controls
                  style={{ width: '100%', maxWidth: '400px' }}
                />
                {post.caption && <div className="text-muted mt-2 small">{post.caption}</div>}
              </div>
            )}

          </Card.Body>
        </Card>
      ))}
    </div>
  );
}

export default FeedPage;
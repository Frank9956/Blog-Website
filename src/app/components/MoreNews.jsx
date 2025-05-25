'use client';

import { useEffect, useState } from 'react';
import RecentPosts from './RecentPosts';

export default function MoreNews({ initialLimit = 9 }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/post/get', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            limit: initialLimit,
            skip: 2,
            category: '',
            order: '',
          }),
          cache: 'no-store',
        });

        const data = await res.json();
        setPosts(data.posts || []);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [initialLimit]);

  if (loading) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  return (
    <div className="space-y-6">
      {posts.map(post => (
        <div key={post._id}>
          <RecentPosts posts={[post]} />
        </div>
      ))}
    </div>
  );
}

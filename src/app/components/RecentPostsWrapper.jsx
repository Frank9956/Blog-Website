'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import RecentPosts from './RecentPosts';

export default function RecentPostsWrapper({ initialLimit = 9 }) {
  const [posts, setPosts] = useState([]);
  const [skip, setSkip] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();
  const sentinelRef = useRef(); // 👈 separate div for IntersectionObserver
  const contentRef = useRef(null);
  const fetchedIds = useRef(new Set());

  const fetchPosts = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const res = await fetch('/api/post/get', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          limit: initialLimit,
          skip,
          category: '',
          order: '',
        }),
        cache: 'no-store',
      });

      const data = await res.json();
      const newPosts = (data.posts || []).filter(post => !fetchedIds.current.has(post._id));

      newPosts.forEach(post => fetchedIds.current.add(post._id));

      if (newPosts.length === 0) {
        setHasMore(false);
      } else {
        setPosts(prev => [...prev, ...newPosts]);
        setSkip(prev => prev + initialLimit);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const observeSentinel = useCallback(() => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        fetchPosts();
      }
    });
    if (sentinelRef.current) observer.current.observe(sentinelRef.current);
  }, [fetchPosts]);

  useEffect(() => {
    fetchPosts(); // initial load
  }, []);

  useEffect(() => {
    observeSentinel(); // re-attach observer after posts update
  }, [posts]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div ref={contentRef} className="space-y-6 h-full overflow-y-auto no-scrollbar">
      {posts.map(post => (
        <div key={post._id}>
          <RecentPosts posts={[post]} />
        </div>
      ))}

      <div ref={sentinelRef} className="h-1" />

      {loading && <p className="text-center text-gray-500"></p>}

      {!hasMore && (
        <div className="text-center mt-8">
          <button
            onClick={scrollToTop}
            style={{ backgroundColor: '#F16136' }}
            className="px-4 py-2 text-white rounded-md hover:opacity-90 transition"
          >
            ⬆ Back to Top
          </button>
        </div>
      )}
    </div>
  );
}

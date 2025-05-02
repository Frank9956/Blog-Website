'use client'

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Sidepost from '../components/Sidepost';

export default function AllPosts({ limit }) {
  const pathname = usePathname(); // ✅ Move hook to the top

  const [categories, setCategories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const shouldHide = pathname.startsWith('/dashboard') || pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up');

  useEffect(() => {
    if (shouldHide) return; // Don't fetch if we won't render

    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/category');
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    const fetchPosts = async () => {
      try {
        const result = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/post/get`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ limit, category: '', order: '' }),
        });

        if (!result.ok) throw new Error(`Failed to fetch: ${result.statusText}`);

        const data = await result.json();
        setPosts(data.posts || []);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
    fetchPosts();
  }, [limit, shouldHide]);

  if (shouldHide) return <div className="w-[0%]" />;

  if (loading) return <div className="text-center text-xl"></div>;

  if (error) return <div className="text-center text-xl text-red-500">Error: {error}</div>;

  if (!posts || posts.length === 0) return <div className="text-center text-xl"></div>;

  return (
    <div className="md:w-100 mr-4">
      <div className="flex flex-col pl-4 justify-center items-center mb-5">
        <div className="flex flex-wrap gap-5 mt-5 justify-center">
          {posts.map((post) => (
            <Sidepost key={post._id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}

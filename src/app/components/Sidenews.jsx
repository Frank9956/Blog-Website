'use client'

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';  // Import usePathname to get the current path
import Sidepost from '../components/Sidepost'; // Assuming you have this component for rendering posts

export default function AllPosts({ limit }) {
  const [categories, setCategories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // To handle errors
  
  const pathname = usePathname(); // Get the current path
  // Condition to check if we are on the dashboard page
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up')) {
    return (<div className="w-[0%]"></div>);
  }
  
  useEffect(() => {
    // Fetch categories
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/category');
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };


    // Fetch posts
    const fetchPosts = async () => {
      try {
        const result = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/post/get`,  {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            limit: limit,
            category: '', // No category filtering
            order: '', // No ordering
          }),
        });

        if (!result.ok) {
          throw new Error(`Failed to fetch: ${result.statusText}`);
        }

        const data = await result.json();
        setPosts(data.posts || []); // Handle case where there are no posts
      } catch (error) {
        console.error('Error fetching posts:', error);
        setError(error.message); // Set error message in state
      }
    };

    fetchCategories();
    fetchPosts();

    setLoading(false); // Set loading to false after the fetches complete
  }, [limit]); // Re-fetch if the limit changes

  // While loading, show loading spinner
  if (loading) {
    return <div className="text-center text-xl"></div>;
  }

  // If there's an error, show an error message
  if (error) {
    return <div className="text-center text-xl text-red-500">Error: {error}</div>;
  }

  // If no posts are found
  if (!posts || posts.length === 0) {
    return <div className="text-center text-xl"></div>;
  }

  

  return (
    <div className="md:w-100 mr-4">
    <div className="flex flex-col pl-4 justify-center items-center mb-5">
      <div className="flex flex-wrap gap-5 mt-5 justify-center">
        {/* Render posts */}
        {posts.map((post) => (
          <Sidepost key={post._id} post={post} />
        ))}
      </div>
    </div>
    </div>
  );
}

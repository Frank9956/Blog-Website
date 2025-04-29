'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import PostCard from '../components/PostCard';

export default function CategoryPage() {
  const { category } = useParams();
  const [posts, setPosts] = useState([]);
  const [categoryDescription, setCategoryDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    if (category) {
      fetchCategoryDescription(category);
      fetchPosts(category);
    }
  }, [category]);

  // Fetch the category description
  const [categoryName, setCategoryName] = useState('');

  const fetchCategoryDescription = async (categorySlug) => {
    try {
      const res = await fetch('/api/category/get', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ slug: categorySlug }),
      });
  
      if (res.ok) {
        const data = await res.json();
        setCategoryDescription(data.description || 'No description available');
        setCategoryName(data.name || categorySlug); // fallback if name missing
      } else {
        setCategoryDescription('Category not found.');
        setCategoryName(categorySlug);
      }
    } catch (error) {
      setCategoryDescription('Failed to fetch category description.');
      setCategoryName(categorySlug);
      console.error('Error fetching category description:', error);
    }
  };
  
  

  const fetchPosts = async (cat) => {
    setLoading(true);
    const res = await fetch('/api/post/get', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        limit: 9,
        category: cat,
        order: 'desc',
      }),
    });

    if (res.ok) {
      const data = await res.json();
      setPosts(data.posts);
      setShowMore(data.posts.length === 9);
    } else {
      setPosts([]);
    }
    setLoading(false);
  };

  const handleShowMore = async () => {
    const res = await fetch('/api/post/get', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        limit: 9,
        startIndex: posts.length,
        category: category,
        order: 'desc',
      }),
    });

    if (res.ok) {
      const data = await res.json();
      setPosts((prev) => [...prev, ...data.posts]);
      setShowMore(data.posts.length === 9);
    }
  };

  return (
    <div className="mx-10">
<h1 className="text-4xl font-bold mb-4 capitalize">{categoryName}</h1>
<p className="text-gray-600 dark:text-gray-400 mb-6">
        {categoryDescription}
      </p>

      <div className="flex flex-wrap gap-4">
        {!loading && posts.length === 0 && (
          <p className="text-xl text-gray-500">No posts found.</p>
        )}
        {loading && <p className="text-xl text-gray-500"></p>}
        {!loading &&
          posts.map((post) => <PostCard key={post._id} post={post} />)}
      </div>

      {showMore && (
        <div className="text-center mt-6">
          <button
            onClick={handleShowMore}
            className="text-teal-500 text-lg hover:underline p-7 w-full"
          >
            Show More
          </button>
        </div>
      )}
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaUniversity, FaLaptop, FaGavel } from 'react-icons/fa';
import Link from 'next/link';
import PostCard from '../components/PostCard';

// Categories displayed like in Home page
const categories = [
  { name: 'Medical', icon: <FaUniversity />, value: 'medical' },
  { name: 'Engineering', icon: <FaLaptop />, value: 'engineering' },
  { name: 'Law', icon: <FaGavel />, value: 'law' },
  { name: 'Board', icon: <FaGavel />, value: 'board' },
  { name: 'Uncategorized', icon: <FaGavel />, value: 'uncategorized' },
];

export default function Search() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('uncategorized');

  const searchParams = useSearchParams();
  const router = useRouter();

  const fetchPosts = async (category) => {
    setLoading(true);
    const res = await fetch('/api/post/get', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        limit: 9,
        category: category || 'uncategorized',
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

  useEffect(() => {
    const categoryFromUrl = searchParams.get('category') || 'uncategorized';
    setSelectedCategory(categoryFromUrl);
    fetchPosts(categoryFromUrl);
  }, [searchParams]);

  const handleCategoryClick = (catValue) => {
    router.push(`/search?category=${catValue}`);
    setSelectedCategory(catValue);
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
        category: selectedCategory,
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
    <div className="flex min-h-screen bg-white dark:bg-black text-black dark:text-white">
      {/* Sidebar with Categories */}
      <aside className="w-[20%] hidden md:block sticky top-0 h-screen border-r border-gray-300 dark:border-gray-700 p-6 pl-15">
        <ul className="space-y-8">
          {categories.map((cat) => (
            <li key={cat.value} className="flex items-center gap-4 font-bold">
              <Link
                href={`/search?category=${cat.value}`}
                className="flex items-center gap-4 relative group"
              >
                <span className="text-xl">{cat.icon}</span>
                <span className="text-xl group-hover:text-blue-500 transition-colors duration-300">
                  {cat.name}
                </span>
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              </Link>


            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content */}
      <main className="w-full md:w-[80%] p-6 flex flex-col gap-10">
        <div className="mx-10">
          <h1 className="text-4xl font-bold mb-4 capitalize">
            {selectedCategory} News
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Showing latest updates and posts from the "{selectedCategory}" category.
          </p>

          <div className="flex flex-wrap gap-4">
            {!loading && posts.length === 0 && (
              <p className="text-xl text-gray-500">No posts found.</p>
            )}
            {loading && <p className="text-xl text-gray-500">Loading...</p>}
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
      </main>
    </div>
  );
}

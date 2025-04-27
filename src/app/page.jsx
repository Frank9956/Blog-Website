'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaGraduationCap } from 'react-icons/fa'; // Same icon for all categories
import RecentPosts from './components/RecentPosts';

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  // Ensure fetch response and headers are properly handled asynchronously
  async function fetchCategories() {
    try {
      const res = await fetch('/api/category');
      
      // Check if the response is ok before continuing
      if (!res.ok) {
        throw new Error('Failed to fetch categories');
      }
      
      // Await and parse JSON response
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      setError('Unable to load categories. Please try again later.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-white dark:bg-black text-black dark:text-white">
      {/* Sidebar */}
      <aside className="w-[20%] hidden md:block sticky top-0 h-screen border-r border-gray-300 dark:border-gray-700 p-6 pl-15">
        <ul className="space-y-8">
          {loading ? (
            <li>Loading categories...</li>
          ) : error ? (
            <li>{error}</li>
          ) : (
            categories.map((category) => (
              <li key={category._id} className="flex items-center gap-4 font-bold">
                <Link
                  href={`/${category.slug}`}
                  className="flex items-center gap-4 relative group"
                >
                  <span className="text-xl">{<FaGraduationCap />}</span> {/* Same icon for all */}
                  <span className="text-xl group-hover:text-blue-500 transition-colors duration-300 uppercase">
                    {category.name}
                  </span>
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                </Link>
              </li>
            ))
          )}
        </ul>
      </aside>

      {/* Main Content */}
      <main className="w-full md:w-[100%] p-6 flex flex-col gap-10">
        <div className="mx-10">
          <h1 className="text-4xl font-bold mb-2">Latest Education News</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Stay updated with the latest developments, entrance exams, policy changes, and breakthroughs in the fields of Medical, Engineering, Law, and Board education.
          </p>

          <RecentPosts limit={9} />

          <div className="text-center mt-6">
            <Link
              href="/uncategorized"
              className="font-bold hover:text-orange dark:hover:text-orange mx-4"
            >
              View all posts
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

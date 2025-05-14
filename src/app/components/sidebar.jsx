'use client';

import Link from 'next/link';
import { FaGraduationCap } from 'react-icons/fa';
import { usePathname } from 'next/navigation';
import { useRef } from 'react';

export default function Sidebar({ categories = [] }) {
  const path = usePathname();
  const categoryRefs = useRef({});

  // Handle category click to smoothly scroll to it
  const handleCategoryClick = (slug) => {
    const element = categoryRefs.current[slug];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="md:w-full mr-2">
      {/* Desktop sidebar */}
      <aside className="w-full hidden md:block sticky top-0 max-h-screen dark:border-gray-700 p-6">
        <div className="space-y-3">
          {categories.length > 0 ? (
            categories.map((cat) => {
              const isActive = path === `/${cat.slug}`;
              return (
                <Link
                  key={cat._id}
                  href={`/${cat.slug}`}
                  className="block"
                  onClick={() => handleCategoryClick(cat.slug)} // Handle click
                >
                  <div
                    className={`flex justify-between items-center border p-3 rounded-md transition-colors ${
                      isActive
                        ? 'bg-orange-100 text-orange-600 border-orange-300 dark:bg-orange-900 dark:text-white'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <div className="flex gap-2 items-center">
                      <FaGraduationCap
                        className={`text-xl ${
                          isActive ? 'text-orange-600 dark:text-white' : 'text-orange-500'
                        }`}
                      />
                      <span className="ml-1 font-bold text-lg">{cat.name}</span>
                    </div>
                  </div>
                </Link>
              );
            })
          ) : (
            <p>No categories available.</p>
          )}
        </div>
      </aside>

      {/* Mobile horizontal slider */}
      <div
        className="md:hidden w-full overflow-x-auto whitespace-nowrap px-4 py-2 border-t border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-black no-scrollbar"
      >
        <div className="flex space-x-4 no-scrollbar">
          {categories.length > 0 ? (
            categories.map((category) => {
              const isActive = path === `/${category.slug}`;
              return (
                <Link
                  key={category.slug}
                  href={`/${category.slug}`}
                  className={`px-4 py-2 rounded-full border text-sm font-medium whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-orange-100 text-orange-600 border-orange-300 dark:bg-orange-900 dark:text-white'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-white border-transparent'
                  }`}
                  ref={(el) => {
                    if (el) categoryRefs.current[category.slug] = el; // Assign ref for each category
                  }}
                >
                  {category.name}
                </Link>
              );
            })
          ) : (
            <p>No categories available.</p>
          )}
        </div>
      </div>
    </div>
  );
}

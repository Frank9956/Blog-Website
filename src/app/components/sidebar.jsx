'use client';

import Link from 'next/link';
import { FaGraduationCap } from 'react-icons/fa';
import { usePathname } from 'next/navigation';

export default function Sidebar({ categories = [] }) {
  const path = usePathname();

  return (
    <div className="md:w-100 mr-2">
      {/* Desktop sidebar */}
      <aside className="w-full hidden md:block sticky top-0 max-h-screen dark:border-gray-700 p-6">
        <div className="space-y-3">
          {categories.length > 0 ? (
            categories.map((cat) => (
              <Link key={cat._id} href={`/${cat.slug}`} className="block">
                <div className="flex justify-between items-center border p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <div className="flex gap-2 items-center">
                    <FaGraduationCap className="text-xl text-orange-500" />
                    <span className="ml-1 font-bold text-lg">{cat.name}</span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p>No categories available.</p>
          )}
        </div>
      </aside>

      {/* Mobile horizontal slider */}
      <div className="md:hidden w-full overflow-x-auto whitespace-nowrap px-4 py-2 border-t border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-black no-scrollbar">
        <div className="flex space-x-4 no-scrollbar">
          {categories.length > 0 ? (
            categories.map((category) => (
              <Link
                key={category.slug}
                href={`/${category.slug}`}
                className={`px-4 py-2 rounded-full border text-sm font-medium whitespace-nowrap transition-colors ${
                  path === `/${category.slug}`
                    ? 'bg-orange-100 text-orange-600 border-orange-300 dark:bg-orange-900 dark:text-white'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-white border-transparent'
                }`}
              >
                {category.name}
              </Link>
            ))
          ) : (
            <p>No categories available.</p>
          )}
        </div>
      </div>
    </div>
  );
}

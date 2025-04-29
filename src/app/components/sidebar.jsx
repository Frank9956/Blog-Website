'use client'

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaGraduationCap  } from 'react-icons/fa';
import { usePathname } from 'next/navigation';  // Import usePathname to get the current path

export default function Sidebar() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      const res = await fetch('api/category');
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  }

  const pathname = usePathname(); // Get the current path
  // Condition to check if we are on the dashboard page
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up')) {
    return (<div className="w-[0%]"></div>);
  }


  return (
    <div className="md:w-100">


      <aside className="w-[100%] hidden md:block sticky top-0 max-h-screen border-r border-gray-300 dark:border-gray-700 p-6 pl-15">
        <div className="space-y-3">
          {categories.length > 0 ? (
            categories.map((cat) => (
              <div key={cat._id} className="flex justify-between items-center border p-3 rounded-md ">
                <Link
                  href={`/${cat.slug}`}
                  className="flex items-center gap-4 font-bold text-lg hover:text-blue-500"
                >
                  <FaGraduationCap className="text-xl text-orange-500" />
                  <span>{cat.name}</span>
                </Link>
              </div>
            ))
          ) : (
            <p>Loading....</p>
          )}
        </div>
      </aside>
    </div>
  );
}

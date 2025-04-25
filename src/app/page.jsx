import Link from 'next/link';
import { FaGraduationCap, FaUniversity, FaLaptop, FaGavel } from 'react-icons/fa'; // Import relevant icons
import RecentPosts from './components/RecentPosts'; // Adjust the path if needed

export default function Home() {
  const categories = [
    { name: 'CUET PG', icon: <FaGraduationCap /> },
    { name: 'CUET UG', icon: <FaGraduationCap /> },
    { name: 'NEET PG', icon: <FaUniversity /> },
    { name: 'NEET UG', icon: <FaUniversity /> },
    { name: 'ENGINEERING', icon: <FaLaptop /> },
    { name: 'LAW', icon: <FaGavel /> }
  ];

  return (
    <div className="flex min-h-screen bg-white dark:bg-black text-black dark:text-white">
      {/* Sidebar */}
      <aside className="w-[20%] hidden md:block sticky top-0 h-screen border-r border-gray-300 dark:border-gray-700 p-6 pl-8">
        <ul className="space-y-4">
          {categories.map((category, index) => (
            <li
              key={category.name}
              className={`flex items-center gap-2 text-left font-bold hover:underline hover:text-black dark:hover:text-white transition ${index === 0 ? 'mt-4' : ''}`}
            >
              <Link href={`/search?category=${category.name.toLowerCase()}&searchTerm=CUET++2025`} className="flex items-center gap-2" passHref>
                <span className="text-lg">{category.icon}</span>
                <span>{category.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main content area */}
      <main className="w-full md:w-[100%] p-6 flex flex-col gap-10">
        <div className="max-w-4xl mx-10">
          <h1 className="text-4xl font-bold mb-2">Latest Posts</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Browse the newest posts, no matter the category.
          </p>

          {/* Updated flex container for the posts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            <RecentPosts limit={9} />
          </div>

          <div className="text-center mt-6">
            <Link href="/search" className="underline hover:text-black dark:hover:text-white">
              View all posts
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

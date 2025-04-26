import Link from 'next/link';
import { FaGraduationCap, FaUniversity, FaLaptop, FaGavel, FaBook } from 'react-icons/fa';
import RecentPosts from './components/RecentPosts';

export default function Home() {
  const categories = [
    { name: 'Medical', icon: <FaUniversity />, value: 'medical' },
    { name: 'Engineering', icon: <FaLaptop />, value: 'engineering' },
    { name: 'Law', icon: <FaGavel />, value: 'law' },
    { name: 'Board', icon: <FaGraduationCap />, value: 'board' },
    { name: 'Uncategorized', icon: <FaBook />, value: 'uncategorized' },
  ];

  return (
    <div className="flex min-h-screen bg-white dark:bg-black text-black dark:text-white">
      {/* Sidebar */}
      <aside className="w-[20%] hidden md:block sticky top-0 h-screen border-r border-gray-300 dark:border-gray-700 p-6 pl-15">
        <ul className="space-y-8">
          {categories.map((category) => (
            <li key={category.name} className="flex items-center gap-4 font-bold">
              <Link
                href={`/search?category=${category.value}`}
                className="flex items-center gap-4 relative group"
              >
                <span className="text-xl">{category.icon}</span>
                <span className="text-xl group-hover:text-blue-500 transition-colors duration-300">
                  {category.name}
                </span>
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              </Link>
            </li>
          ))}
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
              href="/search"
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

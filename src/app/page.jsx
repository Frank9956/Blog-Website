import Link from 'next/link';
import { FaGraduationCap, FaUniversity, FaLaptop, FaGavel } from 'react-icons/fa';
import RecentPosts from './components/RecentPosts';

export default function Home() {
  const categories = [
    { name: 'NEET UG', icon: <FaUniversity /> },
    { name: 'CUET UG', icon: <FaGraduationCap /> },
    { name: 'NEET PG', icon: <FaUniversity /> },
    { name: 'CUET PG', icon: <FaGraduationCap /> },
    { name: 'ENGINEERING', icon: <FaLaptop /> },
    { name: 'LAW CLAT', icon: <FaGavel /> }
  ];

  return (
    <div className="flex min-h-screen bg-white dark:bg-black text-black dark:text-white">
  {/* Sidebar */}
  <aside className="w-[20%] hidden md:block sticky top-0 h-screen border-r border-gray-300 dark:border-gray-700 p-6 pl-15">
    <ul className="space-y-8">
      {categories.map((category, index) => (
        <li
          key={category.name}
          className={`flex items-center gap-4 text-left font-bold transition-all duration-300 ${index === 0 ? 'mt-4' : ''}`}
        >
          <Link
            href={`/search?category=${category.name.toLowerCase()}`}
            className="flex items-center gap-4 relative group"
            passHref
          >
            <span className="text-xl">{category.icon}</span>
            <span className="text-xl group-hover:text-blue-500 transition-colors duration-300">{category.name}</span>
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
            Stay updated with the latest developments, entrance exams, policy changes, and breakthroughs in the fields of Medical and Engineering education.
          </p>


          <RecentPosts limit={9} />

          <div className="text-center mt-6">
          <Link href="/search" className="font-bold hover:text-orange dark:hover:text-orange mx-4">
          View all posts
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

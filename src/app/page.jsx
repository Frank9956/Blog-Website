'use client';

import Link from 'next/link';
import RecentPosts from './components/RecentPosts';
import useIsMobile from './hooks/useIsMobile'; // adjust path if needed

export default function Home() {
  const isMobile = useIsMobile(); // breakpoint defaults to 768px
  const postLimit = isMobile ? 3 : 9;

  return (
    <div className="flex min-h-screen bg-white dark:bg-black text-black dark:text-white">
      <main className="w-full md:w-[100%] flex flex-col gap-10">
        <div>
          <h1 className="text-4xl font-bold mb-2 mx-10">Latest Education News</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8 mx-10">
            Stay updated with the latest developments, entrance exams, policy changes, and breakthroughs in the fields of Medical, Engineering, Law, and Board education.
          </p>

          <RecentPosts limit={postLimit} />
        </div>
      </main>
    </div>
  );
}

import Link from 'next/link';
import RecentPosts from './components/RecentPosts';

export default function Home() {
  return (
    <div className="flex min-h-screen bg-white dark:bg-black text-black dark:text-white ">
      <main className="w-full md:w-[100%]  flex flex-col gap-10">
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

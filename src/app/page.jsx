import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

import RecentPostsWrapper from './components/RecentPostsWrapper';
import CategoryWrapper from './components/CategoryWrapper';
import Sidenews from './components/Sidenews';
import Footer from './components/Footer';
import PageSkeleton from './components/PageSkeleton';
import { getTotalPostsCount } from '@/lib/mongodb/mongoose';

export default async function Home({ searchParams }) {
  const page = parseInt(searchParams.page) || 1;
  const limit = 9;
  const skip = (page - 1) * limit;

  if (page < 1) redirect('/?page=1');

  const totalPosts = await getTotalPostsCount();
  const totalPages = Math.ceil(totalPosts / limit);

  if (page > totalPages && totalPages > 0) redirect(`/?page=${totalPages}`);

  return (
    <div className="flex flex-col min-h-screen">
      <Suspense fallback={<PageSkeleton />}>
        <div className="flex flex-1 flex-col lg:flex-row">
          <div className="w-full lg:w-auto h-auto lg:h-[calc(100vh-60px)] overflow-y-auto border-b lg:border-b-0 lg:border-r border-border no-scrollbar">
            <CategoryWrapper />
          </div>

          <main className="flex-1 py-5 h-auto lg:h-[calc(100vh-60px)] overflow-y-auto no-scrollbar w-full">
            <div className="px-4 sm:px-6 lg:px-10">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
                Latest Education News
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6 sm:mb-8">
                Stay updated with the latest developments in Medical, Engineering, Law, and Board education.
              </p>

              <RecentPostsWrapper limit={limit} skip={skip} />

              <div className="mt-8 flex justify-center gap-2 flex-wrap">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <Link
                    key={p}
                    href={p === 1 ? '/' : `/?page=${p}`}
                    scroll={false}
                    className={`px-3 py-1 rounded-md text-sm font-medium border ${page === p
                      ? 'bg-primary text-white'
                      : 'bg-background text-foreground hover:bg-muted'
                    }`}
                  >
                    {p}
                  </Link>
                ))}
              </div>
            </div>
          </main>

          {/* Right Sidebar - Side News */}
          <div className="w-full lg:w-auto h-auto lg:h-[calc(100vh-80px)] overflow-y-auto border-t lg:border-t-0 lg:border-l border-border no-scrollbar">
            <Sidenews limit={4} />
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </Suspense>
    </div>
  );
}

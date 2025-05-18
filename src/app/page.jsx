// Home.jsx
import CategoryWrapper from './components/CategoryWrapper';
import Sidenews from './components/Sidenews';
import Footer from './components/Footer';
import PageSkeleton from './components/PageSkeleton';
import RecentPostsWrapper from './components/RecentPostsWrapper';
import { Suspense } from 'react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen lg:m-auto">
      <Suspense fallback={<PageSkeleton />}>
        <div className="flex justify-center w-full px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-[1280px] flex flex-1 flex-col lg:flex-row">
            <div className="w-full lg:w-auto h-auto lg:h-[calc(100vh-60px)] overflow-y-auto border-b lg:border-b-0 lg:border-r border-border no-scrollbar">
              <CategoryWrapper />
            </div>

            <main className="flex-1 p-5 h-auto lg:h-[calc(100vh-60px)] overflow-y-auto no-scrollbar w-full">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">Latest Education News</h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6 sm:mb-8">
                Stay updated with the latest developments in Medical, Engineering, Law, and Board education.
              </p>

              <RecentPostsWrapper initialLimit={9} />
            </main>

            <div className="w-auto h-auto lg:h-[calc(100vh-80px)] overflow-y-auto border-t lg:border-t-0 lg:border-l border-border no-scrollbar">
              <Sidenews limit={4} />
            </div>
          </div>
        </div>

        <Footer />
      </Suspense>
    </div>
  );
}

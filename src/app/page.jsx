import RecentPostsWrapper from './components/RecentPostsWrapper';
import CategoryWrapper from './components/CategoryWrapper';
import Sidenews from './components/Sidenews';
import Footer from './components/Footer';

export default function Home() {
  const isMobile = false; // Replace with actual detection logic
  const postLimit = isMobile ? 3 : 9;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Main content fills available height */}
      <div className="flex flex-1 lg:flex-row">
        {/* Sidebar */}
        <div className="w-full lg:w-auto h-auto lg:h-[calc(100vh-80px)] overflow-y-auto border-b lg:border-b-0 lg:border-r border-border no-scrollbar">
          <CategoryWrapper />
        </div>

        {/* Main */}
        <main className="flex-1 py-5 h-auto lg:h-[calc(100vh-60px)] overflow-y-auto no-scrollbar w-full">
          <div className="px-4 sm:px-6 lg:px-10">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
              Latest Education News
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6 sm:mb-8">
              Stay updated with the latest developments in Medical, Engineering, Law, and Board education.
            </p>
            <RecentPostsWrapper limit={postLimit} />
          </div>
        </main>

        {/* Side News */}
        <div className="w-full lg:w-auto r-0 h-auto lg:h-[calc(100vh-80px)] overflow-y-auto border-t lg:border-t-0 lg:border-l border-border no-scrollbar">
          <Sidenews limit={4} />
        </div>
      </div>

      {/* Footer always at bottom */}
      <Footer />
    </div>
  );
}

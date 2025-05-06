import RecentPostsWrapper from './components/RecentPostsWrapper';
import Sidebar from './components/sidebar';
import Sidenews from './components/Sidenews';


export default function Home() {
  const isMobile = false; // You can detect this client-side with a hook

  const postLimit = isMobile ? 3 : 9; // This logic can only run client-side

  return (
    <div className="flex">

      <div className="w-full lg:w-auto h-auto lg:h-[calc(100vh-80px)] overflow-y-auto border-b lg:border-b-0 lg:border-r border-border no-scrollbar">
        <Sidebar />
      </div>


      {/* Main Page Content */}
      <main className="max-w-5xl flex-1 pt-5 h-auto lg:h-[calc(100vh-60px)] overflow-y-auto no-scrollbar">
        <div>
          <h1 className="text-4xl font-bold mb-2 mx-10">Latest Education News</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8 mx-10">
            Stay updated with the latest developments in Medical, Engineering, Law, and Board education.
          </p>
          <RecentPostsWrapper limit={postLimit} />
        </div>
      </main>

      {/* Conditionally render Sidenews */}

      <div className="w-full lg:w-[auto] r-0 h-auto lg:h-[calc(100vh-80px)] overflow-y-auto border-t lg:border-t-0 lg:border-l border-border no-scrollbar">
        <Sidenews limit={4} />
      </div>

    </div>
  );
}

import RecentPostsWrapper from './components/RecentPostsWrapper';

export default function Home() {
  const isMobile = false; // You can detect this client-side with a hook

  const postLimit = isMobile ? 3 : 9; // This logic can only run client-side

  return (
    <div className="flex min-h-screen bg-white dark:bg-black text-black dark:text-white">
      <main className="w-full md:w-[100%] flex flex-col gap-10">
        <div>
          <h1 className="text-4xl font-bold mb-2 mx-10">Latest Education News</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8 mx-10">
            Stay updated with the latest developments in Medical, Engineering, Law, and Board education.
          </p>
          <RecentPostsWrapper limit={postLimit} />
        </div>
      </main>
    </div>
  );
}

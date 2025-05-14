export default function PageSkeleton() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-white dark:bg-black">
      <div className="flex flex-col w-full max-w-[1280px] flex-1  ">

        {/* Mobile Slider */}
        <div className="md:hidden w-full overflow-x-auto whitespace-nowrap py-2 border-t border-b border-gray-200 dark:border-gray-700 animate-pulse">
          <div className="flex space-x-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="px-4 py-2 rounded-full border text-sm font-medium bg-gray-200 dark:bg-gray-700 w-24 h-9"
              ></div>
            ))}
          </div>
        </div>

        {/* Main Layout */}
        <div className="flex flex-1 w-full ">
          {/* Left Sidebar */}
          <aside className="hidden md:block w-[305px] sticky top-0 h-screen  animate-pulse p-6">
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center border p-3 rounded-md bg-gray-200 dark:bg-gray-700"
                >
                  <div className="w-6 h-6 bg-gray-300 rounded-full mr-3"></div>
                  <div className="h-5 bg-gray-300 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto no-scrollbar animate-pulse px-2 sm:px-4 min-h-screen py-10">
            {/* Title and Description */}
            <div className="h-8 bg-gray-300 rounded mb-2 w-1/2"></div>
            <div className="h-4 bg-gray-300 rounded mb-6 w-1/3"></div>

            {/* Cards Grid */}
            <div className="w-[640px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 pr-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="flex w-full border rounded-lg overflow-hidden border-gray-300 dark:border-gray-700 bg-white dark:bg-black animate-pulse"
                >
                  {/* Left - Text Skeleton */}
                  <div className="flex-1 p-4 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-4/5"></div>
                      <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-2/5"></div>
                    </div>
                    <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mt-2"></div>
                  </div>

                  {/* Right - Image Skeleton */}
                  <div className="w-64 h-32  bg-gray-300 dark:bg-gray-700 p-2 rounded-r-lg shrink-0"></div>
                </div>
              ))}
            </div>
          </main>

          {/* Right Sidebar */}
          <aside className="hidden lg:block w-[320px] h-screen overflow-y-auto border-l border-border no-scrollbar animate-pulse p-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-2 px-4 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-black mb-4"
              >
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                </div>
                <div className="w-24 h-16 bg-gray-300 dark:bg-gray-700 rounded-sm flex-shrink-0 ml-4"></div>
              </div>
            ))}
          </aside>
        </div>
      </div>
    </div>
  );
}

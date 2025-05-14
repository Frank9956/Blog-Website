export default function PageSkeleton() {
    return (
      <div className="flex flex-col min-h-screen w-[100vw] pt-[10px]">
        {/* Mobile Slider Skeleton (move outside flex row so it stacks above main content) */}
        <div className="md:hidden w-full overflow-x-auto whitespace-nowrap px-4 py-2 border-t border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-black animate-pulse">
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
        <div className="flex flex-1 w-full">
          {/* Left Sidebar - Categories (Desktop only) */}
          <div className="hidden md:block md:w-100 sticky top-0 h-screen p-6 animate-pulse">
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center border p-3 rounded-md bg-gray-200 dark:bg-gray-700"
                >
                  <div className="w-6 h-6 bg-gray-300 rounded-full mr-3"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
  
          {/* Main Content */}
          <main className="flex-1 py-5 overflow-y-auto no-scrollbar animate-pulse px-4 sm:px-6 min-h-screen">
            <div className="px-4 sm:px-6">
              {/* Title and Description */}
              <div className="h-8 bg-gray-300 rounded mb-2 w-1/2"></div>
              <div className="h-4 bg-gray-300 rounded mb-6 w-1/3"></div>
  
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i}>
                    {/* Mobile Skeleton */}
                    <div className="sm:hidden flex w-full border rounded-lg overflow-hidden border-gray-300 bg-white dark:border-gray-700 dark:bg-black animate-pulse">
                      <div className="flex-1 p-4 space-y-2">
                        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-4/5"></div>
                        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-2/5"></div>
                      </div>
                      <div className="w-32 h-32 bg-gray-300 dark:bg-gray-700 p-2 rounded-r-lg"></div>
                    </div>
  
                    {/* Desktop Skeleton */}
                    <div className="hidden sm:block group relative w-full sm:w-[300px] h-[340px] overflow-hidden rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-black animate-pulse">
                      <div className="w-full h-[200px] bg-gray-300 dark:bg-gray-700"></div>
                      <div className="p-4 space-y-2">
                        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
                        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
                        <div className="h-2 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
                      </div>
                      <div className="absolute left-4 right-4 bottom-4 h-9 rounded bg-gray-300 dark:bg-gray-700"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>
  
          {/* Right Sidebar (Desktop only) */}
          <div className="hidden lg:block w-[410px] h-full overflow-y-auto border-l border-border no-scrollbar animate-pulse p-4">
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
          </div>
        </div>
      </div>
    );
  }
  
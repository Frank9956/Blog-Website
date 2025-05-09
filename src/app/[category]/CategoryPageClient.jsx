import PostCard from '@/app/components/PostCard';
import CategoryWrapper from '@/app/components/CategoryWrapper';
import Sidenews from '@/app/components/Sidenews';

export const dynamic = 'force-dynamic'; // if you need no caching

export default async function CategoryPage({ params }) {
  const category = params.category;

  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/post/get`, {
    method: 'POST',
    body: JSON.stringify({
      category,
      limit: 9,
      startIndex: 0,
      order: 'desc',
    }),
    cache: 'no-store',
  });

  const data = await res.json();
  const posts = data.posts || [];

  const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
  const categoryDescription = `Explore recent posts in the ${categoryName} category.`;

  return (
    <div className="flex flex-col lg:flex-row">
      <div className="w-full lg:w-auto h-auto lg:h-[calc(100vh-80px)] overflow-y-auto border-b lg:border-b-0 lg:border-r border-border no-scrollbar">
        <CategoryWrapper />
      </div>

      <main className="max-w-5xl flex-1 pt-5 h-auto lg:h-[calc(100vh-60px)] overflow-y-auto no-scrollbar">
        <div className="mx-10">
          <h1 className="text-4xl font-bold mb-4 capitalize">{categoryName}</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {categoryDescription}
          </p>

          <div className="flex flex-wrap gap-4">
            {posts.length === 0 ? (
              <p className="text-xl text-gray-500">No posts found.</p>
            ) : (
              posts.map((post) => <PostCard key={post._id} post={post} />)
            )}
          </div>
        </div>
      </main>

      <div className="w-full lg:w-[auto] r-0 h-auto lg:h-[calc(100vh-80px)] overflow-y-auto border-t lg:border-t-0 lg:border-l border-border no-scrollbar">
        <Sidenews limit={4} />
      </div>
    </div>
  );
}

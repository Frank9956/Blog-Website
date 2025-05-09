import PostCard from '@/app/components/PostCard';
import CategoryWrapper from '@/app/components/CategoryWrapper';
import Sidenews from '@/app/components/Sidenews';

export const dynamic = 'force-dynamic'; // ensures fresh data every request (SSR)

export async function generateMetadata({ params }) {
  const category = params.category.toUpperCase();
  return {
    title: `${category} - Entrance Fever`,
    description: `Browse latest articles in ${category}.`,
  };
}

export default async function CategoryPage({ params }) {
  const category = params.category;

  // Fetch posts and category details in parallel
  const [postRes, catRes] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_URL}/api/post/get`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ limit: 9, category, order: 'desc' }),
      cache: 'no-store',
    }),
    fetch(`${process.env.NEXT_PUBLIC_URL}/api/category/get`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: category }),
      cache: 'no-store',
    }),
  ]);

  const postData = await postRes.json();
  const catData = await catRes.json();

  const posts = postData.posts || [];
  const categoryName = catData.name || category;
  const categoryDescription = catData.description || 'No description available.';

  return (
    <div className="flex flex-col lg:flex-row">
      {/* Sidebar */}
      <div className="w-full lg:w-auto h-auto lg:h-[calc(100vh-80px)] overflow-y-auto border-b lg:border-b-0 lg:border-r border-border no-scrollbar">
              <CategoryWrapper />
            </div>
      

      {/* Main Content */}
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

      {/* Side News */}
      <div className="w-full lg:w-[auto] r-0 h-auto lg:h-[calc(100vh-80px)] overflow-y-auto border-t lg:border-t-0 lg:border-l border-border no-scrollbar">
        <Sidenews limit={4} />
      </div>
    </div>
  );
}

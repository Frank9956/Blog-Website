import PostCard from '@/app/components/PostCard';
import CategoryWrapper from '@/app/components/CategoryWrapper';
import Sidenews from '@/app/components/Sidenews';
import Link from 'next/link';


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
    <div className="flex justify-center w-full px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row w-full max-w-[1280px] min-h-screen">

        {/* Sidebar */}
        <aside className="w-full lg:w-auto border-b lg:border-b-0 lg:border-r border-border no-scrollbar">
          <CategoryWrapper />
        </aside>

        {/* Main Content */}
        <main className="flex-1 px-2 sm:px-4 lg:px-10 py-6 overflow-y-auto">
          <nav className="text-sm text-gray-500 mb-3">
            <ul className="flex items-center gap-1">
              <li>
              <Link href="/" className="hover:underline font-medium text-gray-800 uppercase">Home</Link>
              </li>
              <li className="mx-1 text-gray-400">{'>'}</li>
              <li className="text-orange-600 font-medium ">{categoryName}</li>
            </ul>
          </nav>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 capitalize">
            {categoryName}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm sm:text-base">
            {categoryDescription}
          </p>

          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4">
            {posts.length === 0 ? (
              <p className="text-lg text-gray-500">No posts found.</p>
            ) : (
              posts.map((post) => <PostCard key={post._id} post={post} />)
            )}
          </div>
        </main>

        {/* Side News */}
        <aside className="w-full lg:w-auto border-t lg:border-t-0 lg:border-l border-border no-scrollbar">
          <Sidenews limit={4} />
        </aside>
      </div>
    </div>
  );
}
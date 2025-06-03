import MoreNews from '@/app/components/MoreNews';
import Image from 'next/image';
import Link from 'next/link';
import CategoryWrapper from '@/app/components/CategoryWrapper';
import Sidenews from '@/app/components/Sidenews';
import { FiUser } from 'react-icons/fi';
import Footer from '@/app/components/Footer';


export async function generateMetadata({ params }) {
  try {
    const { slug } = await params; // Await the params object
    const result = await fetch(process.env.NEXT_PUBLIC_URL + '/api/post/get', {
      method: 'POST',
      body: JSON.stringify({ slug }),
      cache: 'no-store',
    });
    const data = await result.json();
    const post = data.posts[0];

    return {
      title: post?.title || 'Post not found',
      description: post?.content?.slice(0, 150) || 'Read this post on our blog',
    };
  } catch {
    return {
      title: 'Post not found',
      description: 'An error occurred while loading the post.',
    };
  }
}


export default async function PostPage({ params }) {
  let post = null;
  let author = null;

  try {
    // Fetch the post using params.slug directly
    const result = await fetch(process.env.NEXT_PUBLIC_URL + '/api/post/get', {
      method: 'POST',
      body: JSON.stringify({ slug: params.slug }), // Directly use params.slug
      cache: 'no-store',
    });
    const data = await result.json();
    post = data.posts[0];

  } catch {
    post = { title: 'Failed to load post' };
  }

  if (!post || post.title === 'Failed to load post') {
    return (
      <main className='p-4 flex flex-col max-w-6xl mx-auto min-h-screen'>
        <h2 className='text-2xl sm:text-3xl mt-10 text-center font-serif'>
          Post not found
        </h2>
      </main>
    );
  }

  function formatCategory(slug) {
    return slug
      ?.split('-')
      .map(word => word.toUpperCase())
      .join(' ');
  }

  return (
    <div className="flex flex-col min-h-screen lg:m-auto">
      {/* Content Wrapper */}
      <div className="flex justify-center w-full px-4 sm:px-6 lg:px-8 flex-1">
        <div className="flex flex-1 flex-col lg:flex-row w-full max-w-[1280px]">

          {/* Sidebar */}
          <aside className="w-full lg:w-auto border-b lg:border-b-0 lg:border-r border-border no-scrollbar">
            <CategoryWrapper />
          </aside>

          {/* Main Content - Scrollable */}
          <main className="flex-1 px-2 sm:px-4 lg:px-10 py-6 overflow-y-auto h-[calc(100vh-60px)] no-scrollbar">
            <nav className="text-sm text-gray-500 mb-4">
              <ul className="flex items-center gap-1 flex-wrap">
                <li>
                  <Link href="/" className="hover:underline font-medium text-gray-800 uppercase">Home</Link>
                </li>
                <li className="mx-1 text-gray-400">{'>'}</li>
                <li>
                  <Link
                    href={`/${post?.category}`} className="hover:underline text-gray-800 font-medium">
                    {formatCategory(post?.category)}
                  </Link>

                </li>
                <li className="mx-1 text-gray-400">{'>'}</li>
                <li className="text-orange-600 font-medium truncate max-w-[200px]">
                  {post?.title}
                </li>
              </ul>
            </nav>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
              {post?.title}
            </h1>


            <div className="my-4 relative w-full max-h-[500px] aspect-video">
              <Image
                src={post?.image || '/default-image.jpg'}
                alt={post?.title || 'Post image'}
                fill
                loading="lazy" 
                className="object-cover rounded-lg shadow"
                sizes="100vw"
              />
            </div>

            <div className="flex justify-between text-sm text-gray-500 border-b pb-2 mb-4">
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              <span className="italic">
                {(post?.content?.length / 1000).toFixed(0)} mins read
              </span>
            </div>

            <div
              className="prose dark:prose-invert max-w-full"
              dangerouslySetInnerHTML={{ __html: post?.content }}
            ></div>

            {post?.author && (
              <div className="my-10">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  Who wrote this?
                </h3>
                <div className="flex items-center gap-4 border rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
                  <div className="w-16 h-16 rounded-full dark:bg-gray-800 flex items-center justify-center">
                    <FiUser className="w-10 h-10 text-gray-500 dark:text-gray-300" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold">{post.author.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {post.author.description || 'No bio available.'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-10">
              <MoreNews initialLimit={3} />
            </div>
          </main>

          {/* Side News */}
          <aside className="w-full lg:w-auto border-t lg:border-t-0 lg:border-l border-border no-scrollbar">
            <Sidenews limit={4} />
          </aside>
        </div>
      </div>

      {/* Sticky Footer */}
      <Footer />
    </div>
  );


}

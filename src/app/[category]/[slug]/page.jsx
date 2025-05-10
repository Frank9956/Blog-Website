import RecentPostsWrapper from '@/app/components/RecentPostsWrapper';
import { Button } from 'flowbite-react';
import Link from 'next/link';
import CategoryWrapper from '@/app/components/CategoryWrapper';
import Sidenews from '@/app/components/Sidenews';
import { FiUser } from 'react-icons/fi';

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

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Sidebar */}
      <aside className="w-full lg:w-auto border-b lg:border-b-0 lg:border-r border-border no-scrollbar">
        <CategoryWrapper />
      </aside>

      {/* Main Content */}
      <main className='flex-1 px-4 sm:px-6 lg:px-10 py-6'>
        <h1 className='text-2xl sm:text-3xl md:text-4xl font-bold'>
          {post?.title}
        </h1>

        <div className="my-4">
          <Link href={`/${post.category}`}>
            <Button color='gray' pill size='xs'>
              {post?.category}
            </Button>
          </Link>
        </div>

        <div className="my-4">
          <img
            src={post?.image || '/default-image.jpg'}
            alt={post?.title}
            className='w-full max-h-[500px] object-cover rounded-lg shadow'
          />
        </div>

        <div className='flex justify-between text-sm text-gray-500 border-b pb-2 mb-4'>
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          <span className='italic'>
            {(post?.content?.length / 1000).toFixed(0)} mins read
          </span>
        </div>

        <div
          className='prose dark:prose-invert max-w-full'
          dangerouslySetInnerHTML={{ __html: post?.content }}
        ></div>

        <div className='mt-10'>
          <RecentPostsWrapper limit={3} />
        </div>

        {/* Author Info */}
        {post?.author && (
          <div className="my-10">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              Who wrote this?
            </h3>
            <div className="flex items-center gap-4 border rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
              <img
                src="https://source.unsplash.com/random/150x150" // Dummy profile image
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <p className="text-lg font-semibold">{post.author.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {post.author.description || 'No bio available.'}
                </p>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Side News */}
      <aside className="w-full lg:w-auto border-t lg:border-t-0 lg:border-l border-border no-scrollbar">
        <Sidenews limit={4} />
      </aside>
    </div>
  );
}

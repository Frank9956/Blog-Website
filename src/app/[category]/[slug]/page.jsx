
import RecentPostsWrapper from '@/app/components/RecentPostsWrapper';
import { Button } from 'flowbite-react';
import Link from 'next/link';
import CategoryWrapper from '@/app/components/CategoryWrapper';
import Sidenews from '@/app/components/Sidenews';


export async function generateMetadata({ params }) {
  try {
    const result = await fetch(process.env.URL + '/api/post/get', {
      method: 'POST',
      body: JSON.stringify({ slug: params.slug }),
      cache: 'no-store',
    });
    const data = await result.json();
    const post = data.posts[0];

    return {
      title: post?.title || 'Post not found',
      description: post?.content?.slice(0, 150) || 'Read this post on our blog',
    };
  } catch (error) {
    return {
      title: 'Post not found',
      description: 'An error occurred while loading the post.',
    };
  }
}

export default async function PostPage({ params }) {
  let post = null;
  try {
    const result = await fetch(process.env.URL + '/api/post/get', {
      method: 'POST',
      body: JSON.stringify({ slug: params.slug }),
      cache: 'no-store',
    });
    const data = await result.json();
    post = data.posts[0];
  } catch (error) {
    post = { title: 'Failed to load post' };
  }

  if (!post || post.title === 'Failed to load post') {
    return (
      <main className='p-3 flex flex-col max-w-6xl mx-auto min-h-screen'>
        <h2 className='text-3xl mt-10 p-3 text-center font-serif max-w-5xl mx-auto lg:text-4xl'>
          Post not found
        </h2>
      </main>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row">
      {/* Conditionally render Sidebar based on hideSidebar */}
      
      <div className="w-full lg:w-auto h-auto lg:h-[calc(100vh-80px)] overflow-y-auto border-b lg:border-b-0 lg:border-r border-border no-scrollbar">
        <CategoryWrapper />
      </div>
 
      {/* Main Page Content */}
      <main className='px-3 flex flex-col max-w-5xl mx-auto min-h-screen'>
        {/* Title */}
        <h1 className='text-3xl px-3 text-left font-bold max-w-5xl lg:text-4xl'>
          {post?.title}
        </h1>

        {/* Category Button */}
        <div className="flex p-3">
          <Link href={`/${post.category}`} className='self-center'>
            <Button color='gray' pill size='xs'>
              {post?.category}
            </Button>
          </Link>
        </div>

        {/* Image */}
        <img
          src={post?.image}
          alt={post?.title}
          className='mt-10 p-3 max-h-[600px] w-full object-cover'
        />

        {/* Info Section */}
        <div className='flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-5xl text-xs'>
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          <span className='italic'>
            {(post?.content?.length / 1000).toFixed(0)} mins read
          </span>
        </div>

        {/* Content */}
        <div
          className='p-3 max-w-5xl mx-auto w-full post-content bg-white dark:bg-transparent text-black dark:text-white rounded-md'
          dangerouslySetInnerHTML={{ __html: post?.content }}
        ></div>

        {/* Recent Posts */}
        <div className='max-w-5xl mx-auto w-full dark:bg-transparent'>
          <RecentPostsWrapper limit={3} />
        </div>
      </main>

      {/* Conditionally render Sidenews */}
      
        <div className="w-full lg:w-[auto] r-0 h-auto lg:h-[calc(100vh-80px)] overflow-y-auto border-t lg:border-t-0 lg:border-l border-border no-scrollbar">
          <Sidenews limit={4} />
        </div>
      
    </div>
)}

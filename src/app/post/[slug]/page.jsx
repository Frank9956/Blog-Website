import RecentPosts from '@/app/components/RecentPosts';
import { Button } from 'flowbite-react';
import Link from 'next/link';

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
        <h2 className='text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl'>
          Post not found
        </h2>
      </main>
    );
  }

  return (
    <main className='p-3 flex flex-col max-w-3xl mx-auto min-h-screen'>
      {/* Title */}
      <h1 className='text-3xl mt-10 p-3 text-left font-serif max-w-2xl lg:text-4xl'>
        {post?.title}
      </h1>

      {/* Category Button */}
      <div className="flex p-3">
        <Link
          href={`/search?category=${post?.category?.toLowerCase()}`}
          className='self-center'
        >
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
      <div className='flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs'>
        <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
        <span className='italic'>
          {post && (post?.content?.length / 1000).toFixed(0)} mins read
        </span>
      </div>

      {/* Content */}
      <div
  className='p-3 max-w-2xl mx-auto w-full post-content bg-white dark:bg-transparent text-black dark:text-white rounded-md'
  dangerouslySetInnerHTML={{ __html: post?.content }}
></div>


      {/* Recent Posts */}
      <div className='max-w-4xl mx-auto w-full dark:bg-transparent'>
        <RecentPosts limit={3} />
      </div>
    </main>
  );
}

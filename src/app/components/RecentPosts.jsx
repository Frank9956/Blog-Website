'use client';

import PostCard from './PostCard';

export default function RecentPosts({ posts }) {
  if (!posts || posts.length === 0) {
    return <div className="text-center text-xl">No recent posts found.</div>;
  }

  return (
    <div className="flex flex-wrap gap-5 mt-5 justify-center">
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  );
}

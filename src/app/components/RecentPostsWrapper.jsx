import RecentPosts from './RecentPosts';

async function fetchPosts(limit, skip) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/post/get`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ limit, skip, category: '', order: '' }),
      cache: 'no-store',
    });

    const data = await res.json();
    return data.posts || [];
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

export default async function RecentPostsWrapper({ limit = 9, skip = 0 }) {
  const posts = await fetchPosts(limit, skip);
  return <RecentPosts posts={posts} />;
}

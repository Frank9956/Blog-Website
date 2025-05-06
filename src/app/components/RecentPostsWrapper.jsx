import RecentPosts from './RecentPosts';

async function fetchPosts(limit) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/post/get`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ limit, category: '', order: '' }),
      cache: 'no-store',
    });

    const data = await res.json();
    return data.posts || [];
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

export default async function RecentPostsWrapper({ limit = 9 }) {
  const posts = await fetchPosts(limit);
  return <RecentPosts posts={posts} />;
}

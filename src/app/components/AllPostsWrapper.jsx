// app/components/AllPostsWrapper.jsx

import RecentPosts from './RecentPosts';
import PostCard from './PostCard';

async function fetchCategories() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/category`, {
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('Failed to fetch categories');
    return await res.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

async function fetchPosts(limit = 4) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/post/get`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ limit, category: '', order: '' }),
      cache: 'no-store',
    });
    if (!res.ok) throw new Error(`Failed to fetch posts: ${res.statusText}`);
    const data = await res.json();
    return data.posts || [];
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

export default async function AllPostsWrapper({ limit = 4 }) {
  const [categories, posts] = await Promise.all([
    fetchCategories(),
    fetchPosts(limit),
  ]);

  return <RecentPosts posts={posts} />;
}

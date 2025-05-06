import PostCard from '../components/PostCard';

async function fetchCategories() {
  try {
    const res = await fetch(`${process.env.BASE_URL}/api/category`, {
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
      body: JSON.stringify({
        limit,
        category: '',
        order: '',
      }),
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

export default async function AllPosts({ limit = 4 }) {
  const [categories, posts] = await Promise.all([
    fetchCategories(),
    fetchPosts(limit),
  ]);

  if (!posts || posts.length === 0) {
    return <div className="text-center text-xl">No posts found.</div>;
  }

  return (
    <div className="flex flex-col justify-center items-center mb-5 px-4 sm:px-0">
      <div className="flex flex-wrap gap-5 mt-5 justify-center">
        {posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
    </div>
  );
}

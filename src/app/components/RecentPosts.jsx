import PostCard from '../components/PostCard';

export default async function AllPosts({ limit }) {
  let posts = null;
  try {
    const result = await fetch(process.env.URL + '/api/post/get', {
      method: 'POST',
      body: JSON.stringify({
        limit: limit, // Keeps the limit for pagination (optional)
        category: '', // Ensure no category filtering is applied
        order: '', // No ordering, so it returns all posts
      }),
      cache: 'no-store',
    });
    const data = await result.json();
    posts = data.posts;
  } catch (error) {
    console.log('Error getting posts:', error);
  }

  return (
    <div className='flex flex-col justify-center items-center mb-5'>
      <div className='flex flex-wrap gap-5 mt-5 justify-center'>
        {posts && posts.map((post) => <PostCard key={post._id} post={post} />)}
      </div>
    </div>
  );
}

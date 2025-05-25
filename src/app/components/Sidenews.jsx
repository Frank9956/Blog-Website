
import Sidepost from '../components/Sidepost';

async function fetchPosts(limit = 4) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/post/get`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ limit,skip : 3, category: '', order: '' }),
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
 

  

  const posts = await fetchPosts(limit);

  if (!posts.length) return <div className="text-center text-xl">No posts found.</div>;

  return (
    <div className="md:w-[320px] mr-4">
      <div className="flex flex-col pl-4 justify-center items-center mb-5">
        <div className="flex flex-wrap gap-5 mt-5 justify-center">
          {posts.map((post) => (
            <Sidepost key={post._id} post={post} />
          ))}
        </div>
      </div>
      
    </div>

    
  );
}

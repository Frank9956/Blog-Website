import Link from 'next/link';

export default function PostCard({ post }) {
  const formattedDate = new Date(post.createdAt).toLocaleDateString();

  return (
    <div className="flex w-full border rounded-lg overflow-hidden rounded-md border border-gray-200 dark:border-gray-700 
        hover:border-orange-500 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 
        bg-white dark:bg-black">
      {/* Left - Text */}
      <div className="flex-1 p-4 flex flex-col justify-between text-black dark:text-white ">
        <Link href={`/${post.category}/${post.slug}`}>
          <p className="text-base font-semibold line-clamp-3 ">{post.title}</p>
        </Link>
        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          <span className="italic">{post.category}</span>
        </div>
      </div>
  
      {/* Right - Image */}
      <Link
        href={`/${post.category}/${post.slug}`}
        className="flex items-center justify-center w-32 h-32 sm:w-32 sm:h-20 lg:w-64 lg:h-32 shrink-0 rounded"
      >
        <img
          src={post.image || '/default-image.jpg'}
          alt={post.title}
          className="w-full h-full object-cover p-2 rounded-sm"
        />
      </Link>
    </div>
  );
}

import Link from 'next/link';
import Image from 'next/image';

export default function PostCard({ post }) {
  const formattedDate = new Date(post.createdAt).toLocaleDateString();
  const truncate = (str, maxLength) => 
    str.length > maxLength ? str.slice(0, maxLength) + "..." : str;
  return (
    <Link
      href={`/${post.category}/${post.slug}`}
      className="flex w-full border rounded-lg overflow-hidden rounded-md border border-gray-200 dark:border-gray-700 
        hover:border-orange-500 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 
        bg-white dark:bg-black no-underline"
    >
      {/* Left - Text */}
      <div className="flex-1 p-4 flex flex-col justify-between text-black dark:text-white">
        <p className="text-base font-semibold line-clamp-3">{post.title}</p>
        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          <span className="italic">{post.category}</span>
        </div>
      </div>

      {/* Right - Image */}
      <div
        className="flex items-center justify-center w-32 h-32 sm:w-32 sm:h-20 lg:w-64 lg:h-32 shrink-0 relative rounded"
      >
        <Image
          src={post.image || '/default-image.jpg'}
          alt={truncate(post.title, 30)} 
          fill
          loading="lazy" // 👈 explicitly added
          sizes="(min-width: 1024px) 256px, (min-width: 640px) 128px, 128px"
          className="object-cover p-2 rounded-sm"
        />
      </div>
    </Link>
  );
}

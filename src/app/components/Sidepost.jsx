import Link from 'next/link';

export default function Sidepost({ post }) {
  return (
    <Link
      href={`/${post.category}/${post.slug}`}
      className="flex w-full items-center justify-between gap-3 py-2 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
    >
      {/* Title */}
      <div className="flex-1 text-sm sm:text-base font-medium text-black dark:text-white line-clamp-2">
        {post.title}
      </div>

      {/* Image */}
      <div className="w-24 h-16 flex-shrink-0">
        <img
          src={post.image || '/default-image.jpg'}
          alt={post.title}
          className="w-full h-full object-cover rounded-sm"
        />
      </div>
    </Link>
  );
}

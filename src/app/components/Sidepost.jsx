import Link from 'next/link';

export default function Sidepost({ post }) {
  return (
    <Link
      href={`/${post.category}/${post.slug}`}
      className="group flex w-full items-center justify-between gap-3 py-2 px-3 rounded-md border border-gray-200 dark:border-gray-700 
        hover:border-orange-500 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 
        bg-white dark:bg-black"
    >
      {/* Title */}
      <div className="flex-1 text-sm sm:text-base font-medium text-black dark:text-white line-clamp-2 
        group-hover:text-orange-600 transition-colors">
        {post.title}
      </div>

      {/* Image */}
      <div className="w-24 h-16 flex-shrink-0">
        <img
          src={post.image || '/default-image.jpg'}
          alt={post.title}
          className="w-full h-full object-cover rounded-sm transition-transform duration-300 group-hover:scale-105"
        />
      </div>
    </Link>
  );
}

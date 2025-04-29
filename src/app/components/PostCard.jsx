import Link from 'next/link';

export default function PostCard({ post }) {
  return (
    <div className="group relative w-full sm:w-[330px] h-[360px] overflow-hidden rounded-lg border border-transparent hover:border-white transition-all duration-300 bg-white dark:bg-black">
      {/* Image Link */}
      <Link href={`/${post.category}/${post.slug}`} className="block">
        <img
          src={post.image || '/default-image.jpg'}
          alt={post.title}
          className="w-full h-[200px] object-cover transition-all duration-300 group-hover:scale-105"
        />
      </Link>

      {/* Text Content Link */}
      <Link href={`/${post.category}/${post.slug}`}>
        <div className="p-4 flex flex-col gap-2 text-black dark:text-white">
          <p className="text-lg font-semibold line-clamp-2">{post.title}</p>
          <span className="italic text-sm text-gray-600 dark:text-gray-400">{post.category}</span>
          <span className="text-xs text-gray-500">
            {new Date(post.createdAt).toLocaleDateString()}
          </span>
        </div>
      </Link>

      {/* Read Article Button */}
      <Link
        href={`/${post.category}/${post.slug}`}
        className="absolute left-4 right-4 bottom-[-50px] group-hover:bottom-4 transition-all duration-300 text-center py-2 rounded-md bg-black text-white dark:bg-white dark:text-black dark:hover:bg-orange-500 hover:bg-orange-500 hover:text-white"
      >
        Read article
      </Link>
    </div>
  );
}

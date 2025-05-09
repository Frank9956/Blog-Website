import Link from 'next/link';

export default function PostCard({ post }) {
  const formattedDate = new Date(post.createdAt).toLocaleDateString();

  return (
    <>
      {/* Mobile Layout */}
      <div className="flex sm:hidden w-full border rounded-lg overflow-hidden border-gray-300 dark:border-gray-700 bg-white dark:bg-black hover:border-white transition-all duration-300">
        {/* Left - Text */}
        <div className="flex-1 p-4 flex flex-col justify-between text-black dark:text-white">
          <Link href={`/${post.category}/${post.slug}`}>
            <p className="text-base font-semibold line-clamp-3">{post.title}</p>
          </Link>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            <span className="italic">{post.category}</span>
          </div>
        </div>

        {/* Right - Image */}
        <Link href={`/${post.category}/${post.slug}`} className="block w-32 h-32 shrink-0">
          <img
            src={post.image || '/default-image.jpg'}
            alt={post.title}
            className="w-full h-full object-cover p-2 rounded-r-lg"
          />
        </Link>
      </div>

      {/* Desktop Layout */}
      <div className="hidden sm:block">
        <div className="group relative w-full sm:w-[300px] h-[340px] overflow-hidden rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-black hover:border-white transition-all duration-300">
          {/* Image */}
          <Link href={`/${post.category}/${post.slug}`} className="block">
            <img
              src={post.image || '/default-image.jpg'}
              alt={post.title}
              className="w-full h-[200px] object-cover transition-all duration-300 group-hover:scale-105"
            />
          </Link>

          {/* Text */}
          <Link href={`/${post.category}/${post.slug}`}>
            <div className="p-4 flex flex-col gap-2 text-black dark:text-white">
              <p className="text-lg font-semibold line-clamp-2">{post.title}</p>
              <span className="italic text-sm text-gray-600 dark:text-gray-400">{post.category}</span>
              <span className="text-xs text-gray-500">{formattedDate}</span>
            </div>
          </Link>

          {/* Button */}
          <Link
            href={`/${post.category}/${post.slug}`}
            className="absolute left-4 right-4 bottom-[-50px] group-hover:bottom-4 transition-all duration-300 text-center py-2 rounded-md bg-black text-white dark:bg-white dark:text-black dark:hover:bg-orange-500 hover:bg-orange-500 hover:text-white"
          >
            Read article
          </Link>
        </div>
      </div>
    </>
  );
}

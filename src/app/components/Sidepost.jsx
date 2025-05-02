import Link from 'next/link';

export default function Sidepost({ post }) {
    return (
        <div className="group relative w-full max-w-2xl h-[160px] overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 hover:border-orange-500 hover:shadow-md transition-all duration-300 bg-white dark:bg-black flex hover:-translate-y-1">

            {/* Left - Text Content */}
            <Link
                href={`/${post.category}/${post.slug}`}
                className="flex-1 pl-4 w-[60%] flex flex-col justify-center gap-2 text-black dark:text-white"
            >
                <div>
                    <p className="text-base sm:text-lg font-semibold line-clamp-3 group-hover:text-orange-600 transition-colors">
                        {post.title}
                    </p>
                    <div className="flex flex-col space-y-1">
                        <span className="italic text-sm text-gray-600 dark:text-gray-400">
                            {post.category}
                        </span>
                        <span className="text-xs text-gray-500">
                            {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                </div>

            </Link>

            {/* Right - Image aligned to top with rounded border and scale on hover */}
            <Link
                href={`/${post.category}/${post.slug}`}
                className="flex items-start justify-center w-[40%] sm:w-[40%] p-2"
            >
                <img
                    src={post.image || '/default-image.jpg'}
                    alt={post.title}
                    className="max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-105 rounded-md"
                />
            </Link>
        </div>
    );
}

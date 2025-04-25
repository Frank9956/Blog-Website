import Link from 'next/link';

export default function PostCard({ post }) {
  return (
    <div className='group relative w-full h-[350px] overflow-hidden rounded-lg sm:w-[330px] transition-all border border-transparent hover:border-white'>
      <Link href={`/post/${post.slug}`}>
        <img
          src={post.image || '/default-image.jpg'} // Default image if none is provided
          alt='post cover'
          className='h-[200px] w-full object-cover group-hover:h-[180px] transition-all duration-300'
        />
      </Link>
      <div className='p-3 flex flex-col gap-2'>
        <p className='text-lg font-semibold line-clamp-2 text-white'>{post.title}</p>
        <span className='italic text-sm text-gray-400'>{post.category}</span>
        <span className='text-xs text-gray-500'>{new Date(post.createdAt).toLocaleDateString()}</span>
        <Link
          href={`/post/${post.slug}`}
          className='z-10 absolute bottom-[-50px] left-0 right-0 border border-white text-white hover:bg-black hover:text-white transition-all duration-300 text-center py-2 rounded-md !rounded-tl-none m-2 bg-transparent group-hover:bottom-2 group-hover:bg-black group-hover:border-transparent'
        >
          Read article
        </Link>
      </div>
    </div>
  );
}

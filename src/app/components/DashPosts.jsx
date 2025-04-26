'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export default function DashPosts() {
  const { user } = useUser();
  const [userPosts, setUserPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/post/get', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user?.publicMetadata?.userMongoId,
          }),
        });
        const data = await res.json();
        if (res.ok) {
          setUserPosts(data.posts);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    if (user?.publicMetadata?.isAdmin) {
      fetchPosts();
    }
  }, [user?.publicMetadata?.isAdmin, user?.publicMetadata?.userMongoId]);

  const handleDeletePost = async () => {
    setShowModal(false);
    try {
      const res = await fetch('/api/post/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId: postIdToDelete,
          userId: user?.publicMetadata?.userMongoId,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        const newPosts = userPosts.filter((post) => post._id !== postIdToDelete);
        setUserPosts(newPosts);
        setPostIdToDelete('');
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  if (!user?.publicMetadata?.isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full py-7">
        <h1 className="text-2xl font-semibold">You are not an admin!</h1>
      </div>
    );
  }

  return (
    <div className="flex justify-center w-full p-4 bg-white text-black dark:bg-black dark:text-white">
      <div className="w-full max-w-7xl relative">
        {/* New Post Button */}
        <Link href="/dashboard/create-post">
          <button className="absolute top-4 right-4 z-10 px-5 py-2 rounded-md text-base font-medium bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-100">
            New Post
          </button>
        </Link>

        {userPosts.length > 0 ? (
          <div className="mt-16 overflow-x-auto">
            <table className="min-w-full mx-auto text-base divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-200 dark:bg-gray-800">
                <tr>
                  {['Date', 'Image', 'Title', 'Category', 'Delete', 'Edit'].map((heading) => (
                    <th key={heading} className="px-4 py-4 text-left font-semibold text-black dark:text-white">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-black divide-y divide-gray-200 dark:divide-gray-800">
                {userPosts.map((post) => (
                  <tr key={post._id} className="hover:bg-gray-100 dark:hover:bg-gray-900 transition">
                    <td className="px-4 py-4 text-gray-700 dark:text-gray-300 text-base">
                      {new Date(post.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4">
                      <Link href={`/post/${post.slug}`}>
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-28 h-16 object-cover rounded-md"
                        />
                      </Link>
                    </td>
                    <td className="px-4 py-4 max-w-[250px] truncate text-black dark:text-white font-medium text-base">
                      <Link href={`/post/${post.slug}`} className="hover:underline">
                        {post.title}
                      </Link>
                    </td>
                    <td className="px-4 py-4 text-gray-700 dark:text-gray-300 text-base">
                      {post.category}
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => {
                          setShowModal(true);
                          setPostIdToDelete(post._id);
                        }}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm font-medium"
                      >
                        Delete
                      </button>
                    </td>
                    <td className="px-4 py-4">
                      <Link
                        href={`/dashboard/update-post/${post._id}`}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-medium"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 mt-20 text-lg">
            You have no posts yet!
          </p>
        )}

        {/* Confirm Delete Modal */}
        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent className="sm:max-w-md bg-white dark:bg-black text-black dark:text-white">
            <DialogHeader>
              <DialogTitle className="flex flex-col items-center gap-2 text-center">
                <HiOutlineExclamationCircle className="h-14 w-14 text-gray-500 dark:text-gray-300" />
                Are you sure you want to delete this post?
              </DialogTitle>
            </DialogHeader>
            <DialogFooter className="flex justify-center gap-4 pt-4">
              <button
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-md font-semibold text-base"
                onClick={handleDeletePost}
              >
                Yes, I’m sure
              </button>
              <button
                className="border border-gray-300 dark:border-gray-600 text-black dark:text-white px-5 py-2 rounded-md font-medium text-base"
                onClick={() => setShowModal(false)}
              >
                No, cancel
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

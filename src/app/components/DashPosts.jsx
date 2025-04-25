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
          headers: {
            'Content-Type': 'application/json',
          },
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId: postIdToDelete,
          userId: user?.publicMetadata?.userMongoId,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        const newPosts = userPosts.filter(
          (post) => post._id !== postIdToDelete
        );
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
    <div className="flex justify-center p-4">
      <div className="w-full max-w-7xl relative">
        {/* New Post Button */}
        <Link href="/dashboard/create-post">
          <Button className="absolute top-4 right-4 z-10">New Post</Button>
        </Link>

        {user?.publicMetadata?.isAdmin && userPosts.length > 0 ? (
          <div className="mt-16"> {/* Add margin-top to create space below the button */}
            <table className="w-full text-lg divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-100 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700 dark:text-gray-300">Date</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700 dark:text-gray-300">Image</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700 dark:text-gray-300">Title</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700 dark:text-gray-300">Category</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700 dark:text-gray-300">Username</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700 dark:text-gray-300">Name</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700 dark:text-gray-300">Delete</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700 dark:text-gray-300">Edit</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                {userPosts.map((post) => (
                  <tr key={post._id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                      {new Date(post.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <Link href={`/post/${post.slug}`}>
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-28 h-16 object-cover rounded-md"
                        />
                      </Link>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      <Link href={`/post/${post.slug}`}>{post.title}</Link>
                    </td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{post.category}</td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{post.username}</td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{post.name}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => {
                          setShowModal(true);
                          setPostIdToDelete(post._id);
                        }}
                        className="text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        className="text-blue-500 hover:underline"
                        href={`/dashboard/update-post/${post._id}`}
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
          <p className="text-center text-gray-500 dark:text-gray-400">You have no posts yet!</p>
        )}

        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex flex-col items-center gap-2">
                <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200" />
                Are you sure you want to delete this post?
              </DialogTitle>
            </DialogHeader>
            <DialogFooter className="flex justify-center gap-4 pt-4">
              <Button variant="destructive" onClick={handleDeletePost}>
                Yes, I&apos;m sure
              </Button>
              <Button variant="outline" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

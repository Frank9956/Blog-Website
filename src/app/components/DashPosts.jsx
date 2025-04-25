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
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {user?.publicMetadata?.isAdmin && userPosts.length > 0 ? (
        <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-700 shadow-md">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="border px-4 py-2 text-left">Date Updated</th>
              <th className="border px-4 py-2 text-left">Post Image</th>
              <th className="border px-4 py-2 text-left">Post Title</th>
              <th className="border px-4 py-2 text-left">Category</th>
              <th className="border px-4 py-2 text-left">Delete</th>
              <th className="border px-4 py-2 text-left">Edit</th>
            </tr>
          </thead>
          <tbody>
            {userPosts.map((post) => (
              <tr
                key={post._id}
                className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td className="border px-4 py-2">
                  {new Date(post.updatedAt).toLocaleDateString()}
                </td>
                <td className="border px-4 py-2">
                  <Link href={`/post/${post.slug}`}>
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-20 h-10 object-cover bg-gray-500"
                    />
                  </Link>
                </td>
                <td className="border px-4 py-2">
                  <Link
                    className="font-medium text-gray-900 dark:text-white"
                    href={`/post/${post.slug}`}
                  >
                    {post.title}
                  </Link>
                </td>
                <td className="border px-4 py-2">{post.category}</td>
                <td className="border px-4 py-2">
                  <span
                    className="font-medium text-red-500 hover:underline cursor-pointer"
                    onClick={() => {
                      setShowModal(true);
                      setPostIdToDelete(post._id);
                    }}
                  >
                    Delete
                  </span>
                </td>
                <td className="border px-4 py-2">
                  <Link
                    className="text-teal-500 hover:underline"
                    href={`/dashboard/update-post/${post._id}`}
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>You have no posts yet!</p>
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
  );
}
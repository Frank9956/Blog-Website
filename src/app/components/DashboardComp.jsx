'use client';

import { useState, useEffect } from 'react';
import { HiArrowNarrowUp, HiDocumentText, HiOutlineUserGroup } from 'react-icons/hi';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';

export default function DashboardComp() {

  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [lastMonthUsers, setLastMonthUsers] = useState(0);
  const [lastMonthPosts, setLastMonthPosts] = useState(0);
  const { user } = useUser();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/user/get', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ limit: 5 }),
        });
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          setTotalUsers(data.totalUsers);
          setLastMonthUsers(data.lastMonthUsers);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/post/get', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ limit: 5 }),
        });
        const data = await res.json();
        if (res.ok) {
          setPosts(data.posts);
          setTotalPosts(data.totalPosts);
          setLastMonthPosts(data.lastMonthPosts);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    if (user?.publicMetadata?.isAdmin) {
      fetchUsers();
      fetchPosts();
    }
  }, [user]);

  if (!user?.publicMetadata?.isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full py-7">
        <h1 className="text-2xl font-semibold">You are not an admin!</h1>
      </div>
    );
  }

  if (!mounted) return null;

  return (
    <div className="p-6 w-full bg-white text-black dark:bg-black dark:text-white">
      {/* Stat Cards */}
      <div className="flex-wrap flex gap-6 justify-start">
        {/* Users Card */}
        <div className="flex flex-col p-6 bg-gray-100 dark:bg-gray-900 gap-4 md:w-72 w-full rounded-2xl shadow-sm border border-gray-300 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-gray-600 dark:text-gray-400 text-lg uppercase">Total Users</h3>
              <p className="text-4xl font-semibold">{totalUsers}</p>
            </div>
            <HiOutlineUserGroup className="bg-gray-300 dark:bg-gray-700 text-black dark:text-white rounded-full text-5xl p-3 shadow-sm" />
          </div>
          <div className="flex gap-2 text-lg">
            <span className="text-gray-700 dark:text-gray-300 flex items-center">
              <HiArrowNarrowUp className="mr-1" />
              {lastMonthUsers}
            </span>
            <span className="text-gray-500">Last month</span>
          </div>
        </div>

        {/* Posts Card */}
        <div className="flex flex-col p-6 bg-gray-100 dark:bg-gray-900 gap-4 md:w-72 w-full rounded-2xl shadow-sm border border-gray-300 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-gray-600 dark:text-gray-400 text-lg uppercase">Total Posts</h3>
              <p className="text-4xl font-semibold">{totalPosts}</p>
            </div>
            <HiDocumentText className="bg-gray-300 dark:bg-gray-700 text-black dark:text-white rounded-full text-5xl p-3 shadow-sm" />
          </div>
          <div className="flex gap-2 text-lg">
            <span className="text-gray-700 dark:text-gray-300 flex items-center">
              <HiArrowNarrowUp className="mr-1" />
              {lastMonthPosts}
            </span>
            <span className="text-gray-500">Last month</span>
          </div>
        </div>
      </div>

      {/* Tables */}
      <div className="flex flex-col lg:flex-row gap-6 py-10 justify-center">
        {/* Recent Users */}
        <div className="flex flex-col w-full lg:w-[40%] shadow-sm p-6 rounded-2xl bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700">
          <div className="flex justify-between items-center pb-4">
            <h2 className="text-xl font-semibold">Recent Users</h2>
            <Link href="/dashboard?tab=users">
              <Button
                variant="outline"
                className="border-gray-400 text-gray-700 dark:text-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-800 text-lg"
              >
                See all
              </Button>
            </Link>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-lg text-black dark:text-white">Image</TableHead>
                <TableHead className="text-lg text-black dark:text-white">Username</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>
                    <img
                      src={user.profilePicture}
                      alt="user"
                      className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-700"
                    />
                  </TableCell>
                  <TableCell className="text-lg">{user.username}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Recent Posts */}
        <div className="flex flex-col w-full lg:w-[60%] shadow-sm p-6 rounded-2xl bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700">
          <div className="flex justify-between items-center pb-4">
            <h2 className="text-xl font-semibold">Recent Posts</h2>
            <Link href="/dashboard?tab=posts">
              <Button
                variant="outline"
                className="border-gray-400 text-gray-700 dark:text-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-800 text-lg"
              >
                See all
              </Button>
            </Link>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-lg text-black dark:text-white">Image</TableHead>
                <TableHead className="text-lg text-black dark:text-white">Title</TableHead>
                <TableHead className="text-lg text-black dark:text-white">Category</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((post) => (
                <TableRow key={post._id}>
                  <TableCell>
                    <img
                      src={post.image}
                      alt="post"
                      className="w-20 h-14 rounded-md bg-gray-300 dark:bg-gray-700"
                    />
                  </TableCell>
                  <TableCell className="text-lg max-w-[280px] truncate">{post.title}</TableCell>
                  <TableCell className="text-lg">{post.category}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

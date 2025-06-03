'use client';

import { useEffect, useState } from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { useUser } from '@clerk/nextjs';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'; // Using ShadCN UI components
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function DashUsers() {
  const { user, isLoaded } = useUser();
  const [users, setUsers] = useState([]);

  // Fetch users from the API when the component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/user/get', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userMongoId: user?.publicMetadata?.userMongoId,
          }),
        });

        // Check if the response is okay (status 200)
        if (res.ok) {
          const data = await res.json();
          setUsers(data.users); // Set users in state
        } else {
          // If the response is not okay, handle it here
          const errorData = await res.json();
          console.error('Error fetching users:', errorData.message);
        }
      } catch (error) {
        console.error('Error:', error.message);
      }
    };

    if (user?.publicMetadata?.isAdmin) {
      fetchUsers(); // Fetch users only if the logged-in user is an admin
    }
  }, [user?.publicMetadata?.isAdmin]);

  // Handle toggling admin status for a user
  const handleToggleAdmin = async (targetUserId, currentStatus) => {
    try {
      const res = await fetch('/api/user/update-role', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: targetUserId,
          isAdmin: !currentStatus, // Toggle admin status
        }),
      });

      if (res.ok) {
        // Update the user state locally without needing to refetch all users
        setUsers((prevUsers) =>
          prevUsers.map((u) =>
            u._id === targetUserId ? { ...u, isAdmin: !currentStatus } : u
          )
        );
      } else {
        const errorData = await res.json();
        console.error('Error updating user role:', errorData.message);
      }
    } catch (err) {
      console.error('Request Error:', err.message);
    }
  };

  // Display a message if the user is not an admin
  if (!user?.publicMetadata?.isAdmin && isLoaded) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full py-7">
        <h1 className="text-3xl font-semibold text-black dark:text-white">You are not an admin!</h1>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto md:mx-auto min-w-[1180px] p-6 scrollbar-none dark:bg-black dark:text-white">
      <div className="flex justify-between items-center mb-4">
        <span className="text-2xl font-semibold text-black dark:text-white">
          Manage Users
        </span>
      </div>
  
      {user?.publicMetadata?.isAdmin && users.length > 0 ? (
        <div className="max-h-[calc(100vh-200px)] overflow-y-auto rounded-md">
          <Table className="shadow-md dark:bg-black dark:border-gray-700 ">
            {/* Table Header with Sticky Position */}
            <TableHeader className="sticky top-0 z-10 bg-gray-200 dark:bg-gray-800">
              <TableRow>
                <TableHead className="text-lg text-black dark:text-white">Date Created</TableHead>
                <TableHead className="text-lg text-black dark:text-white">User Image</TableHead>
                <TableHead className="text-lg text-black dark:text-white">Username</TableHead>
                <TableHead className="text-lg text-black dark:text-white">Email</TableHead>
                <TableHead className="text-lg text-black dark:text-white">Admin</TableHead>
                <TableHead className="text-lg text-black dark:text-white">Action</TableHead>
              </TableRow>
            </TableHeader>
            {/* Table Body with Scroll */}
            <TableBody className="overflow-y-auto" style={{ maxHeight: '400px' }}>
              {users.map((userItem) => (
                <TableRow key={userItem._id} className="bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <TableCell className="text-lg text-black dark:text-white">
                    {new Date(userItem.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <img
                      src={userItem.profilePicture}
                      alt={userItem.username}
                      className="w-12 h-12 object-cover bg-gray-500 rounded-full"
                    />
                  </TableCell>
                  <TableCell className="text-lg text-black dark:text-white">{userItem.username}</TableCell>
                  <TableCell className="text-lg text-black dark:text-white">{userItem.email}</TableCell>
                  <TableCell>
                    {userItem.isAdmin ? (
                      <Badge variant="success" className="text-md">
                        <FaCheck className="mr-1" /> Admin
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="text-md">
                        <FaTimes className="mr-1" /> Not Admin
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleAdmin(userItem._id, userItem.isAdmin)}
                    >
                      {userItem.isAdmin ? 'Remove Admin' : 'Make Admin'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <p className="text-xl text-black dark:text-white">You have no users yet!</p>
      )}
    </div>
  );
  
  

  
  
  
}

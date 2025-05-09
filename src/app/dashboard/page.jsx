'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useSearchParams } from 'next/navigation';
import DashSidebar from '../components/DashSidebar';
import DashProfile from '../components/DashProfile';
import DashPosts from '../components/DashPosts';
import DashUsers from '../components/DashUsers';
import DashboardComp from '../components/DashboardComp';
import DashCategories from '../components/DashCategories';
import DashAuthors from '../components/DashAuthors';

export default function Dashboard() {
  const searchParams = useSearchParams();
  const [tab, setTab] = useState('');
  const { user } = useUser();

  useEffect(() => {
    const urlParams = new URLSearchParams(searchParams);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [searchParams]);

  if (!user?.publicMetadata?.isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full py-7">
        <h1 className="text-2xl font-semibold">You are not an admin!</h1>
      </div>
    );
  }

  return (
    <div className="max-h-screen flex flex-col md:flex-row">

      <div className="md:w-100">
        <DashSidebar />
      </div>

      {/* Tabs */}
      {tab === 'profile' && <DashProfile />}
      {tab === 'posts' && <DashPosts />}
      {tab === 'users' && <DashUsers />}
      {tab === 'dash' && <DashboardComp />}
      {tab === 'categories' && <DashCategories />}
      {tab === 'authors' && <DashAuthors />}
    </div>
  );
}

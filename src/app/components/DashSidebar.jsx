'use client';

import Link from 'next/link';
import {
  HiUser,
  HiArrowSmRight,
  HiDocumentText,
  HiOutlineUserGroup,
  HiChartPie,
} from 'react-icons/hi';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { SignOutButton, useUser } from '@clerk/nextjs';
import { cn } from '@/lib/utils'; // from Shadcn setup

export default function DashSidebar() {
  const [tab, setTab] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const searchParams = useSearchParams();
  const { user, isSignedIn } = useUser();

  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user?.id) return;
      try {
        const res = await fetch(`/api/user/get?userId=${user.id}`);
        const data = await res.json();
        setIsAdmin(data.isAdmin);
      } catch (err) {
        console.error('Admin check failed:', err);
      }
    };

    checkAdmin();
  }, [user]);

  if (!isSignedIn) return null;

  const links = [
    { label: 'Dashboard', icon: HiChartPie, href: '/dashboard?tab=dash', adminOnly: true },
    { label: 'Profile', icon: HiUser, href: '/dashboard?tab=profile', adminOnly: false },
    { label: 'Posts', icon: HiDocumentText, href: '/dashboard?tab=posts', adminOnly: true },
    { label: 'Categories', icon: HiDocumentText, href: '/dashboard?tab=categories', adminOnly: true },
    { label: 'Users', icon: HiOutlineUserGroup, href: '/dashboard?tab=users', adminOnly: true },
    { label: 'Authors', icon: HiOutlineUserGroup, href: '/dashboard?tab=authors', adminOnly: true },
  ];

  return (
    <aside className="w-full md:w-56 p-4 border-r bg-white dark:bg-black text-black dark:text-white flex flex-col space-y-2">
      {links.map(({ label, icon: Icon, href, adminOnly }) => {
        if (adminOnly && !isAdmin) return null;
        const isActive = tab === href.split('tab=')[1] || (!tab && href.includes('dash'));
        return (
          <Link key={label} href={href}>
            <div
              className={cn(
                'flex items-center gap-3 px-4 py-2 rounded-xl transition-all hover:bg-muted cursor-pointer',
                isActive ? 'bg-muted font-semibold text-orange-600' : 'text-muted-foreground'
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </div>
          </Link>
        );
      })}

      <div className="mt-auto">
        <div className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-muted cursor-pointer transition-all">
          <HiArrowSmRight className="h-5 w-5" />
          <SignOutButton />
        </div>
      </div>
    </aside>
  );
}

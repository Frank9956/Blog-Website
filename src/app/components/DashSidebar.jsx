'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { SignOutButton, useUser } from '@clerk/nextjs';
import { cn } from '@/lib/utils'; // Utility for merging classes
import {
  HiUser,
  HiArrowSmRight,
  HiDocumentText,
  HiOutlineUserGroup,
  HiChartPie,
} from 'react-icons/hi';

export default function DashSidebar() {
  const [tab, setTab] = useState('');
  const searchParams = useSearchParams();
  const { user, isSignedIn } = useUser();

  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl) setTab(tabFromUrl);
  }, [searchParams]);

  if (!isSignedIn) return null;

  const isAdmin = user?.publicMetadata?.isAdmin;

  const links = [
    { label: 'Dashboard', icon: HiChartPie, href: '/dashboard?tab=dash', adminOnly: true },
    { label: 'Profile', icon: HiUser, href: '/dashboard?tab=profile', adminOnly: false },
    { label: 'Posts', icon: HiDocumentText, href: '/dashboard?tab=posts', adminOnly: true },
    { label: 'Categories', icon: HiDocumentText, href: '/dashboard?tab=categories', adminOnly: true }, // <-- new row
    { label: 'Users', icon: HiOutlineUserGroup, href: '/dashboard?tab=users', adminOnly: true },
  ];

  return (
    <aside className=" w-full md:w-60 border-r bg-white dark:bg-black text-black dark:text-white flex flex-col p-4 space-y-2">
      {links.map((link) => {
        if (link.adminOnly && !isAdmin) return null;

        const isActive = tab === link.href.split('tab=')[1] || (!tab && link.href.includes('dash'));

        return (
          <Link
            key={link.label}
            href={link.href}
            className={cn(
              'flex items-center gap-3 px-4 py-2 rounded-xl transition-all hover:bg-muted',
              isActive ? 'bg-muted font-semibold text-orange-600' : 'text-muted-foreground'
            )}
          >
            <link.icon className="h-6 w-6" />
            <span className="text-md">{link.label}</span>
          </Link>
        );
      })}

      {/* Sign Out Button */}
      <div className="mt-auto">
        <div className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-muted cursor-pointer transition-all">
          <HiArrowSmRight className="h-6 w-6" />
          <SignOutButton />
        </div>
      </div>
    </aside>
  );
}

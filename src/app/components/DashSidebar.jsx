'use client';

import {
  Sidebar,
  SidebarItem,
  SidebarItems,
  SidebarItemGroup,
} from 'flowbite-react';
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
import Link from 'next/link';

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

  return (
    <Sidebar className="w-full md:w-56">
      <SidebarItems>
        <SidebarItemGroup>
          {isAdmin && (
            <Link href="/dashboard?tab=dash">
              <SidebarItem
                icon={HiChartPie}
                active={!tab || tab === 'dash'}
                as="div"
              >
                Dashboard
              </SidebarItem>
            </Link>
          )}

          <Link href="/dashboard?tab=profile">
            <SidebarItem
              icon={HiUser}
              active={tab === 'profile'}
              label={isAdmin ? 'Admin' : 'User'}
              labelColor="dark"
              as="div"
            >
              Profile
            </SidebarItem>
          </Link>

          {isAdmin && (
            <Link href="/dashboard?tab=posts">
              <SidebarItem
                icon={HiDocumentText}
                active={tab === 'posts'}
                as="div"
              >
                Posts
              </SidebarItem>
            </Link>
          )}

          {isAdmin && (
            <Link href="/dashboard?tab=users">
              <SidebarItem
                icon={HiOutlineUserGroup}
                active={tab === 'users'}
                as="div"
              >
                Users
              </SidebarItem>
            </Link>
          )}

          <SidebarItem icon={HiArrowSmRight} as="div" className="cursor-pointer">
            <SignOutButton />
          </SidebarItem>
        </SidebarItemGroup>
      </SidebarItems>
    </Sidebar>
  );
}

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { SignedIn, SignedOut, UserButton, useUser } from '@clerk/nextjs';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function Header() {
  const { user } = useUser();
  const path = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { theme, setTheme } = useTheme();

  const [mounted, setMounted] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('/api/category');
        if (!res.ok) throw new Error('Failed to fetch categories');
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCategories();
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-transparent text-black dark:text-white backdrop-blur-[10px]">
      <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap px-6 pt-4">
        {/* Logo */}
        <Link href="/" className="flex items-center mr-8">
          <Image src="/rmgoe_logo.svg" alt="Logo" width={180} height={60} />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 font-medium text-lg">
          <Link href="https://rmgoe.org/neet_rank_predictor" className="hover:text-orange-600">
            NEET College Predictor
          </Link>
          <Link href="https://rmgoe.org/college_rank_predictor" className="hover:text-orange-600">
            NEET Rank Predictor
          </Link>
          <Link href="/about" className={`${path === '/about' ? 'font-bold text-orange-600' : ''}`}>
            About Us
          </Link>
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-4 ml-auto">
          {/* Theme Toggle */}
          {mounted && (
            <Button
              variant="ghost"
              className="border border-gray-300 dark:border-gray-600"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
            </Button>
          )}

          {/* Auth Buttons */}
          <SignedIn>
            <UserButton
              userProfileUrl="/dashboard?tab=dash"
              appearance={{ elements: { userProfileAvatar: 'w-10 h-10' } }}
            />
          </SignedIn>

          <SignedOut>
            {path.startsWith('/dashboard') && user?.role === 'admin' && (
              <Link href="/sign-in">
                <Button variant="outline">Sign In</Button>
              </Link>
            )}
          </SignedOut>
        </div>
      </div>

      {/* Mobile Horizontal Category Slider
      {!isLoading && (
        <div className="md:hidden w-full overflow-x-auto whitespace-nowrap px-4 py-2 border-t border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-black">
          <div className="flex space-x-4">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/${category.slug}`}
                className={`px-4 py-2 rounded-full border text-sm font-medium whitespace-nowrap transition-colors ${
                  path === `/${category.slug}`
                    ? 'bg-orange-100 text-orange-600 border-orange-300 dark:bg-orange-900 dark:text-white'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-white border-transparent'
                }`}
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      )} */}
    </header>
  );
}

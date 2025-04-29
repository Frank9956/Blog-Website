'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { SignedIn, SignedOut, UserButton, useUser } from '@clerk/nextjs';
import { useTheme } from 'next-themes';
import { Moon, Sun, Search, Menu } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function Header() {
  const { user } = useUser(); // To access current user
  const path = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { theme, setTheme } = useTheme();

  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(searchParams);
    const searchFromUrl = urlParams.get('searchTerm');
    if (searchFromUrl) {
      setSearchTerm(searchFromUrl);
    }
  }, [searchParams]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(searchParams);
    urlParams.set('searchTerm', searchTerm);
    router.push(`/${urlParams.toString()}`);
  };

  return (
    <>
      <header className="fixed top-0 w-full z-50 bg-white text-black dark:bg-black dark:text-white border-b border-border px-6 py-4 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-y-3">
          {/* Logo */}
          <Link href="/" className="flex items-center mr-8 ml-6 border-none">
            <Image
              src="rmgoe_logo.svg"
              alt="Logo"
              width={180}
              height={60}
              className=""
            />
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6 font-medium text-lg">
            <Link href="/engineering" className={`${path === '/engineering' ? 'font-bold text-orange-600' : 'hover:text-orange-600'}`}>
              NEET College Predictor
            </Link>
            <Link href="/law" className={`${path === '/law' ? 'font-bold text-orange-600' : 'hover:text-orange-600'}`}>
              NEET Rank Predictor
            </Link>
            <Link href="/about" className={`${path === '/about' ? 'font-bold text-orange-600' : 'hover:text-orange-600'}`}>
              About Us
            </Link>
          </nav>

          {/* Search, Theme, Auth */}
          <div className="flex items-center gap-4 ml-auto">
            {/* Search */}
            <form onSubmit={handleSubmit} className="hidden lg:flex items-center space-x-3">
              <Input
                className="bg-background text-grey border placeholder:text-gray-500 text-lg px-4 py-2"
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button
                type="submit"
                variant="outline"
                size="icon"
                className="bg-background border placeholder:text-gray-500 text-lg h-9 w-9 flex items-center justify-center"
              >
                <Search className="w-5 h-5" />
              </Button>
            </form>

            {/* Theme Toggle */}
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                className="placeholder:text-gray-500 border hover:bg-muted text-lg"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              >
                {theme === 'dark' ? (
                  <Moon className="w-9 h-9" />
                ) : (
                  <Sun className="w-9 h-9" />
                )}
              </Button>
            )}

            {/* Auth */}
            <SignedIn>
              <UserButton
                userProfileUrl="/dashboard?tab=profile"
                appearance={{
                  elements: { userProfileAvatar: 'w-13 h-13' },
                }}
              />
            </SignedIn>

            {/* Sign In - Only shown for admins trying to access /dashboard */}
            <SignedOut>
              {path.startsWith('/dashboard') && user?.role === 'admin' && (
                <Link href="/sign-in">
                  <Button variant="outline" className="text-black dark:text-white border-black text-lg">
                    Sign In
                  </Button>
                </Link>
              )}
            </SignedOut>

            {/* Mobile Menu */}
            <Button
              variant="ghost"
              className="md:hidden text-black text-lg"
              onClick={() => setIsOpen(!isOpen)}
            >
              <Menu />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden mt-3 flex flex-col gap-3 text-black dark:text-white bg-white dark:bg-black p-4 rounded-md">
            <Link href="/" className={`${path === '/' && 'font-bold'}`}>Home</Link>
            <Link href="/medical" className={`${path === '/medical' && 'font-bold'}`}>Medical</Link>
            <Link href="/engineering" className={`${path === '/engineering' && 'font-bold'}`}>Engineering</Link>
            <Link href="/law" className={`${path === '/law' && 'font-bold'}`}>Law</Link>
            <Link href="/about" className={`${path === '/about' && 'font-bold'}`}>About Us</Link>
          </div>
        )}
      </header>

      {/* Invisible spacer */}
      <div className="h-[80px]" />
    </>
  );
}

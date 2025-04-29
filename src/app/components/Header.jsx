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
  const { user } = useUser();
  const path = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { theme, setTheme } = useTheme();

  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
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

  useEffect(() => {
    const urlParams = new URLSearchParams(searchParams);
    const searchFromUrl = urlParams.get('searchTerm');
    if (searchFromUrl) setSearchTerm(searchFromUrl);
  }, [searchParams]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(searchParams);
    urlParams.set('searchTerm', searchTerm);
    router.push(`/${urlParams.toString()}`);
  };

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-transparent text-black dark:text-white backdrop-blur-[10px]">
      <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap px-6 py-4">
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
          {/* Search */}
          <form onSubmit={handleSubmit} className="hidden lg:flex items-center space-x-3">
            <Input
              className="bg-background text-grey  placeholder:text-gray-500 text-lg px-4 py-2"
              variant="ghost"
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button type="submit" variant="ghost" size="icon">
              <Search className="w-7 h-7" />
            </Button>
          </form>

          {/* Theme Toggle */}
          {mounted && (
            <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
              {theme === 'dark' ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
            </Button>
          )}

          {/* Auth Buttons */}
          <SignedIn>
            <UserButton
              userProfileUrl="/dashboard?tab=profile"
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

          {/* Mobile Menu Toggle */}
          <Button variant="ghost" className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            <Menu />
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`overflow-hidden transition-all duration-300 md:hidden px-6 ${isOpen ? 'max-h-[500px] opacity-100 mt-2' : 'max-h-0 opacity-0 '
          }`}
      >
        <div className="flex flex-col gap-2 bg-transparent backdrop-blur-[10px]  rounded-md py-4 px-4 font-bold">
          {isLoading ? (
            <div>Loading categories...</div>
          ) : (
            categories.map((category) => (
              <Link
                key={category.slug}
                href={`/${category.slug}`}
                onClick={handleLinkClick}
                className={`hover:text-orange-500 transition-colors ${path === `/${category.slug}` ? 'text-orange-600' : ''
                  }`}
              >
                {category.name}
              </Link>
            ))
          )}
          <Link
            href="/about"
            onClick={handleLinkClick}
            className={`hover:text-orange-500 transition-colors ${path === '/about' ? 'text-orange-600' : ''
              }`}
          >
            About Us
          </Link>
        </div>

      </div>
    </header>
  );
}

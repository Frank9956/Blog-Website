'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { useTheme } from 'next-themes';
import { Moon, Sun, Search, Menu } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function Header() {
  const path = usePathname();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(searchParams);
    urlParams.set('searchTerm', searchTerm);
    router.push(`/search?${urlParams.toString()}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(searchParams);
    const searchFromUrl = urlParams.get('searchTerm');
    if (searchFromUrl) {
      setSearchTerm(searchFromUrl);
    }
  }, [searchParams]);

  return (
    <header className="bg-black text-white border-b border-border px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-y-2">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold mr-6">
          <span className="px-2 py-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 rounded-lg text-black font-extrabold">
            Entrance&apos;s
          </span>{' '}
          Fever
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-4 font-medium text-sm">
          <Link href="/" className={`${path === '/' ? 'font-bold underline' : 'hover:underline'}`}>
            Home
          </Link>
          <Link href="/medical" className={`${path === '/medical' ? 'font-bold underline' : 'hover:underline'}`}>
            Medical
          </Link>
          <Link href="/engineering" className={`${path === '/engineering' ? 'font-bold underline' : 'hover:underline'}`}>
            Engineering
          </Link>
          <Link href="/law" className={`${path === '/law' ? 'font-bold underline' : 'hover:underline'}`}>
            Law
          </Link>
          <Link href="/about" className={`${path === '/about' ? 'font-bold underline' : 'hover:underline'}`}>
            ABOUT Us
          </Link>
        </nav>

        {/* Search & Account Section */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Search */}
          <form onSubmit={handleSubmit} className="hidden lg:flex items-center space-x-2">
            <Input
              className="bg-background text-white border border-white placeholder:text-gray-400"
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button type="submit" variant="outline" size="icon" className="text-white border-white">
              <Search className="w-4 h-4" />
            </Button>
          </form>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-muted"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          >
            {theme === 'light' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>

          {/* Auth */}
          <SignedIn>
            <UserButton userProfileUrl="/dashboard?tab=profile" />
          </SignedIn>
          <SignedOut>
            <Link href="/sign-in">
              <Button variant="outline" className="text-white border-white">
                Sign In
              </Button>
            </Link>
          </SignedOut>

          {/* Hamburger for Mobile */}
          <Button variant="ghost" className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
            <Menu />
          </Button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden mt-3 flex flex-col gap-2 text-white">
          <Link href="/" className={`${path === '/' && 'font-bold'}`}>Home</Link>
          <Link href="/medical" className={`${path === '/medical' && 'font-bold'}`}>Medical</Link>
          <Link href="/engineering" className={`${path === '/engineering' && 'font-bold'}`}>Engineering</Link>
          <Link href="/law" className={`${path === '/law' && 'font-bold'}`}>Law</Link>
        </div>
      )}
    </header>
  );
}

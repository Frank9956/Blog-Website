'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { useTheme } from 'next-themes';
import { Moon, Sun, Search, Menu } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from "@/components/ui/button"

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
    <header className="border-b px-4 py-2 flex items-center justify-between">
      {/* Logo/Title */}
      <Link href="/" className="text-xl font-bold">
        <span className="px-2 py-1 bg-gradient-to-r from-blue-500 via-orange-500 to-pink-500 rounded-lg text-white">
          Entrance&apos;s
        </span>{' '}
        Fever
      </Link>

      {/* Search Bar (desktop) */}
      <form onSubmit={handleSubmit} className="hidden lg:flex items-center space-x-2">
        <Input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button type="submit" variant="outline" size="icon">
          <Search className="w-4 h-4" />
        </Button>
      </form>

      {/* Right Side Controls */}
      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        >
          {theme === 'light' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </Button>

        {/* Clerk Auth */}
        <SignedIn>
          <UserButton userProfileUrl="/dashboard?tab=profile" />
        </SignedIn>
        <SignedOut>
          <Link href="/sign-in">
            <Button variant="outline">Sign In</Button>
          </Link>
        </SignedOut>

        {/* Hamburger Menu */}
        <Button variant="ghost" className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          <Menu />
        </Button>
      </div>

      {/* Mobile Nav Links */}
      {isOpen && (
        <nav className="absolute top-16 left-0 w-full bg-background border-t p-4 flex flex-col gap-2 md:hidden">
          <Link
            href="/"
            className={`hover:underline ${path === '/' && 'font-semibold'}`}
          >
            Home
          </Link>
          <Link
            href="/about"
            className={`hover:underline ${path === '/about' && 'font-semibold'}`}
          >
            About
          </Link>
          <Link
            href="/projects"
            className={`hover:underline ${path === '/projects' && 'font-semibold'}`}
          >
            Projects
          </Link>
        </nav>
      )}
    </header>
  );
}

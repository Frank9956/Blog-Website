'use client'; // Marks this as a client component

import localFont from 'next/font/local';
import './globals.css';
import Header from './components/Header';
import { ThemeProvider } from 'next-themes';
import { ClerkProvider } from '@clerk/nextjs';
import Footer from './components/Footer';
import Sidebar from './components/sidebar'; // Default Sidebar
import DashSidebar from './components/DashSidebar'; // Admin Sidebar
import { usePathname } from 'next/navigation'; // Use this for route checking

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});

const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export default function RootLayout({ children }) {
  // Use pathname to detect if on dashboard
  const pathname = usePathname();
  const isDashboardPage = pathname.includes('dashboard'); // Check if current route includes 'dashboard'

  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          suppressHydrationWarning
        >
          {/* ThemeProvider from next-themes for shadcn/ui compatibility */}
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="bg-white text-black dark:bg-black dark:text-white min-h-screen">
              <Header />
              <div className="flex">
                {/* Conditionally render DashSidebar or Sidebar */}
                {isDashboardPage ? (
                  <div className="md:w-56">
                    {/* <DashSidebar /> */}
                  </div>
                ) : (
                  <div className="md:w-100">
                    <Sidebar />
                  </div>
                )}

                {/* Main content area */}
                <main className="w-full">{children}</main>
              </div>
              {/* <Footer /> */}
            </div>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

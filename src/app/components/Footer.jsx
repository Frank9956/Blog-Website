'use client';

import Link from 'next/link';
import {
  FacebookIcon,
  InstagramIcon,
  TwitterIcon,
  YoutubeIcon,
  LinkedinIcon 
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function FooterCom() {
  return (
    <footer className="border-t-4 border-black-500 bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8">
          <div>
            <Link
              href="/"
              className="text-xl font-semibold whitespace-nowrap"
            >
              <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
                Entrance
              </span>{' '}
              Fever
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-sm">
            <div>
              <h1 className="font-semibold mb-2">About</h1>
              <ul className="space-y-1">
                <li>
                  <Link
                    href="https://www.rmgoe.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    RM Group <br /> of Education
                  </Link>
                </li>
                
              </ul>
            </div>

            <div>
              <h1 className="font-semibold mb-2">Follow us</h1>
              <ul className="space-y-1">
                <li>
                  <Link
                    href="https://www.instagram.com/rmgroupofeducation_/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    Instagram
                  </Link>
                </li>
                <li>
                  <Link href="https://www.facebook.com/rmgroupofeducation" className="hover:underline">
                    Facebook
                  </Link>
                </li>
                <li>
                  <Link href="https://x.com/rmgroupofeduca1" className="hover:underline">
                    Twitter
                  </Link>
                </li>
                <li>
                  <Link href="https://www.youtube.com/c/RMGroupofEducation" className="hover:underline">
                    YouTube
                  </Link>
                </li>
                <li>
                  <Link href="https://www.linkedin.com/company/rm-group-of-education/" className="hover:underline">
                    LinkedIn
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h1 className="font-semibold mb-2">Legal</h1>
              <ul className="space-y-1">
                <li>
                  <Link href="#" className="hover:underline">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:underline">
                    Terms &amp; Conditions
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="flex flex-col sm:flex-row items-center justify-between text-sm">
          <p>
            &copy; {new Date().getFullYear()} RM Group of Education. All rights reserved.
          </p>
          <div className="flex gap-4 mt-4 sm:mt-0">
            <Link href="https://www.facebook.com/rmgroupofeducation" aria-label="Facebook">
              <FacebookIcon className="w-5 h-5" />
            </Link>
            <Link href="https://www.instagram.com/rmgroupofeducation_/" aria-label="Instagram">
              <InstagramIcon className="w-5 h-5" />
            </Link>
            <Link href="https://x.com/rmgroupofeduca1" aria-label="Twitter">
              <TwitterIcon className="w-5 h-5" />
            </Link>
            <Link
              href="https://www.youtube.com/c/RMGroupofEducation"
              aria-label="GitHub"
            >
              <YoutubeIcon className="w-5 h-5" />
            </Link>
            <Link href="https://www.linkedin.com/company/rm-group-of-education/" aria-label="Dribbble">
              <LinkedinIcon className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

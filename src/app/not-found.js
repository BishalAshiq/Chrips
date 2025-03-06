'use client';

import NavbarWrapper from './public_components/NavbarWrapper';
import Footer from './public_components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import error from '../../public/images/error.png';
import { useEffect } from 'react';

export default function NotFound() {
  useEffect(() => {
    document.title = "Page Not Found";
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <NavbarWrapper />
      <main className="flex-grow flex items-center justify-center bg-gray-50">
        <div className="text-center px-4">
          <Image
            src={error}
            alt="404 Error"
            width={150}
            height={150}
            className="w-[100px] h-[100px] md:w-[150px] md:h-[150px] mx-auto mb-10"
            priority
          />
          <h2 className="text-xl text-input-title font-bold text-gray-700 mt-5 mb-3">Page Not Found</h2>
          <p className="text-input-title mb-8">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
          <Link href="/" className="bg-green-brand text-white font-semibold px-8 py-3 rounded-sm hover:bg-green-800 transition">
            Go Back Home →
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
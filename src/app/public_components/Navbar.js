'use client';

import Link from 'next/link';
import { useState } from 'react';
import Image from 'next/image';
import logo from '../../../public/images/logo.png';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="rounded-md z-50 relative mx-4">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo Section */}
        <Link href="/" className="flex items-center space-x-3">
          {/* Display logo image */}
          <Image src={logo} alt="ChirpChecker Logo" height={54} />
        </Link>

        {/* Hamburger Icon for Mobile */}
        <div className="lg:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            className="text-gray-600 hover:text-green-800 focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Navigation Links */}
        <div
          className={`${
            menuOpen ? 'block' : 'hidden'
          } lg:block absolute lg:static top-full left-0 w-full lg:w-auto bg-white lg:bg-transparent shadow-lg lg:shadow-none rounded-md lg:rounded-none transition-all duration-300 ease-in-out`}
        >
          <div className="lg:flex lg:space-x-6 px-3 py-4 lg:p-0 space-y-4 lg:space-y-0">
            <Link
              href="/login/"
              className="block lg:inline-block px-6 py-2 text-black-1 font-semibold rounded hover:bg-green-brand  hover:text-white hover:bg-green-800 transition duration-300"
            >
              Log In
            </Link>
            <Link
              href="/signup/"
              className="block lg:inline-block px-6 py-2 text-black-1 font-semibold rounded hover:bg-green-brand hover:text-white hover:bg-green-800 transition duration-300"
            >
              Sign Up
            </Link>

          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

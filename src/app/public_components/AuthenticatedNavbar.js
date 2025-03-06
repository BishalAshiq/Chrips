"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import logo from "../../../public/images/logo.png";
import logomob from "../../../public/images/logomob.png"; // Mini logo for mobile
import userAvatar from "../../../public/images/user-avatar.png"; // User avatar placeholder
import { getCookie, deleteCookie } from "cookies-next";

const API_URL = process.env.NEXT_PUBLIC_AUTH_URL;

const AuthenticatedNavbar = () => {
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [userScore, setUserScore] = useState("7/10"); // Placeholder score
  const pathname = usePathname();
  const router = useRouter(); // ✅ Replaces window.location.href

  useEffect(() => {
    // Ensure cookies are only accessed on the client
    const storedScore = getCookie("user_score") || "7/10"; // Example score storage
    setUserScore(storedScore);
  }, []);

  const handleLogout = async () => {
    const refreshToken = getCookie("refresh_token");
    const accessToken = getCookie("access_token");

    try {
      if (refreshToken && accessToken) {
        await fetch(`${API_URL}/api/logout/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ refresh: refreshToken }),
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    }

    // Delete cookies
    deleteCookie("access_token");
    deleteCookie("refresh_token");
    deleteCookie("user_id");
    deleteCookie("full_name");

    // ✅ Use Next.js router to navigate instead of window
    router.push("/login/");
  };

  return (
    <nav className="rounded-md z-50 relative">
      {/* Mobile Navbar - With Mini Logo */}
      <div className="container mx-auto py-4 flex justify-between items-center lg:hidden">
        <div className="flex items-center space-x-4">
          <Link href="/">
            <Image src={logomob} alt="ChirpChecker Logo" width={32} height={32} />
          </Link>
          <Link
            href="/dashboard/"
            className={`text-base font-semibold ${
              pathname.startsWith("/dashboard") ? "underline decoration-2 underline-offset-8" : ""
            }`}
          >
            Dashboard
          </Link>
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileDropdown(!profileDropdown)}
            className="flex items-center space-x-2 rounded px-2 py-1 hover:bg-green-900 group"
          >
            <Image src={userAvatar} alt="User Avatar" width={20} height={20} className="rounded-full" />
            <span className="text-green-800 font-semibold text-sm group-hover:text-white">{userScore}</span>
            <svg className="w-4 h-4 text-gray-600 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {profileDropdown && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg py-1">
              <Link href="/profile/" className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-900 hover:text-white">
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-green-900 hover:text-white"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Desktop Navbar - With Logo */}
      <div className="container mx-auto px-6 py-4 hidden lg:flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-3">
          <Image src={logo} alt="ChirpChecker Logo" width={240} height={32} />
        </Link>

        <div className="flex items-center space-x-6">
          <Link
            href="/dashboard/"
            className={`text-base font-semibold px-6 py-2 text-black-1 rounded hover:bg-green-900 hover:text-white transition duration-300 ${
              pathname.startsWith("/dashboard") ? "underline decoration-2 underline-offset-8" : ""
            }`}
          >
            Dashboard
          </Link>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileDropdown(!profileDropdown)}
              className="flex items-center space-x-2 rounded px-2 py-1 hover:bg-green-900 group"
            >
              <Image src={userAvatar} alt="User Avatar" width={24} height="auto" className="rounded-full" />
              <span className="text-green-800 font-semibold group-hover:text-white">{userScore}</span>
              <svg className="w-4 h-4 text-gray-600 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {profileDropdown && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                <Link href="/profile/" className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-900 hover:text-white">
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-green-900 hover:text-white"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AuthenticatedNavbar;

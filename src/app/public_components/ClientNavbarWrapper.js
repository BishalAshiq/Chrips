"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { getCookie } from "cookies-next";
import Navbar from "./Navbar";
import AuthenticatedNavbar from "./AuthenticatedNavbar";

export default function ClientNavbarWrapper() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    try {
      const token = getCookie('access_token');
      if (token) {
        const decoded = jwtDecode(token);
        const isTokenValid = decoded.exp * 1000 > Date.now();
        setIsAuthenticated(isTokenValid);

        // Handle protected routes client-side
        if (!isTokenValid && window.location.pathname.startsWith('/dashboard')) {
          router.push('/login/');
        }
      } else if (window.location.pathname.startsWith('/dashboard')) {
        router.push('/login/');
      }
    } catch (error) {
      setIsAuthenticated(false);
      if (window.location.pathname.startsWith('/dashboard')) {
        router.push('/login/');
      }
    }
  }, [router]);

  return isAuthenticated ? <AuthenticatedNavbar /> : <Navbar />;
} 
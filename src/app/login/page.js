"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import NavbarWrapper from '../public_components/NavbarWrapper'; 
import Footer from "../public_components/Footer";
import Image from "next/image";
import checkmark from "../../../public/images/sign-ill.png";
import logo from "../../../public/images/logo.png";
import google from "../../../public/images/google.png";
import apple from "../../../public/images/apple.png";
import facebook from "../../../public/images/facebook.png";
import { jwtDecode } from "jwt-decode";
import Link from "next/link";
import { setCookie, getCookie } from 'cookies-next';
import { withAuthProtection } from "../utils/withAuthProtection";
import logomob from "../../../public/images/logomob.png";
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    document.title = "Log In";
    
    // Check if user is already logged in
    const token = getCookie('access_token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 > Date.now() && decoded.role === "end_user") {
          router.push("/dashboard/");
        }
      } catch (error) {
        // Invalid token, allow access to login page
      }
    }
  }, [router]); 

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
  
    try {
      if (!API_URL) throw new Error("API URL is missing!");
  
      const response = await fetch(`${API_URL}/api/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email: email.trim(), password }),
      });
  
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Login failed. Please try again.");
      }
  
      const data = await response.json();
  
      if (!data.access || !data.refresh) throw new Error("Invalid authentication response");
  
      setCookie('access_token', data.access);
      setCookie('refresh_token', data.refresh);
  
      try {
        const decoded = jwtDecode(data.access);
  
        if (!decoded.user_id || !decoded.role) throw new Error("Invalid token structure");
  
        setCookie('user_id', decoded.user_id);

        await fetchUserDetails(data.access);

        if (decoded.role === "end_user") {
          router.push("/dashboard/");
        } else {
          setError("Unauthorized role. Contact support.");
        }
      } catch (tokenError) {
        throw new Error("Failed to process authentication token");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserDetails = async (token) => {
    try {
      const response = await fetch(`${API_URL}/api/profile/`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch user details.");
      }

      const userData = await response.json();
      setCookie('full_name', userData.full_name);
    } catch (error) {
      // Handle error silently or show user feedback if needed
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden pt-3">
      <NavbarWrapper />
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="hidden lg:flex w-5/12 h-full items-center justify-center">
          <div className="illustration-container w-full h-full bg-[#f8f0e0] rounded-2xl relative flex-1">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <Image src={logomob} alt="ChirpChecker Logo" width="auto" height={160} />
            </div>
            <div className="absolute bottom-4 right-4 text-[#094A19]">
              ChirpChecker©
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-8">
          <div className="max-w-md w-full space-y-6">
            {/* Logo - Hidden on mobile */}
            <div className="hidden lg:flex lg:flex-col items-center mb-4">
              <Image src={logo} alt="ChirpChecker Logo" width="auto" height={54} className="mb-3.5" />
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <p className="text-input-title text-sm">Enter Your Email Address</p>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border px-4 py-3 rounded-md text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-800"
              />

              <p className="text-input-title text-sm mt-4">Enter Password</p>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full border px-4 py-3 rounded-md text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-800"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </button>
              </div>

              <div className="flex justify-center text-center text-input-title text-sm mt-4 mb-2">
                <Link href="/login/recovery">
                  <span className="text-green-800 hover:underline">Forgot Password?</span>
                </Link>
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button type="submit" disabled={loading} className="w-full bg-green-brand text-white font-semibold py-3 rounded-md hover:bg-green-800 transition">
                {loading ? "Processing..." : "Sign In"}
              </button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-100"></div>
              </div>
            </div>

            {/* Social Auth */}
            <div className="space-y-4">
              <p className="text-input-title text-center text-sm pt-6">Continue With Social Media</p>
              <button className="w-full flex items-center justify-center gap-3 border border-neutral-200 rounded-md py-3 hover:bg-gray-100 transition">
                <Image src={google} alt="Google" width={24} height={24} />
                Continue With Google
              </button>
              <button className="w-full flex items-center justify-center gap-3 border border-neutral-200 rounded-md py-3 hover:bg-gray-100 transition">
                <Image src={apple} alt="Apple" width={24} height={24} />
                Continue With Apple
              </button>
              <button className="w-full flex items-center justify-center gap-3 border border-neutral-200 rounded-md py-3 hover:bg-gray-100 transition">
                <Image src={facebook} alt="Facebook" width={24} height={24} />
                Continue With Facebook
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default withAuthProtection(SignInPage, "auth");

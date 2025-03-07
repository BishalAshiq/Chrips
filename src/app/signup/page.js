"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import NavbarWrapper from "../public_components/NavbarWrapper";
import Footer from "../public_components/Footer";
import Image from "next/image";
import checkmark from "../../../public/images/sign-ill.png";
import logo from "../../../public/images/logo.png";
import google from "../../../public/images/google.png";
import apple from "../../../public/images/apple.png";
import facebook from "../../../public/images/facebook.png";
import { setCookie, getCookie } from 'cookies-next';
import Link from "next/link";
import { jwtDecode } from "jwt-decode";
import { withAuthProtection } from "../utils/withAuthProtection";
import logomob from "../../../public/images/logomob.png";

function SignupPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(null); // ✅ Fix: State to store time
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    document.title = "Sign Up";

    // Check if user is already logged in
    const token = getCookie('access_token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 > Date.now() && decoded.role === "end_user") {
          router.push("/dashboard/");
        }
      } catch (error) {
        // Invalid token, allow access to signup page
      }
    }
  }, [router]);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/register/send-otp/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 400) {
          // ✅ If the account exists, redirect to existing user verification
          router.push("/signup/verify/existing/");
          return;
        }
        setError(data.detail || "Failed to send OTP.");
        setLoading(false);
        return;
      }

      // ✅ Store email for OTP verification
      setCookie('user_email', email, { secure: true, sameSite: 'Strict', maxAge: 600 });
      router.push("/signup/verify/");
    } catch (err) {
      setError("Failed to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-white overflow-hidden pt-3">
      <NavbarWrapper />
     <main className="flex-1 flex items-center justify-center p-6">
        {/* Left Side - Illustration */}
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

        {/* Right Side - Sign-Up Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-8">
          <div className="max-w-md w-full space-y-6">
            {/* Logo */}
            <div className="flex flex-col items-center mb-6">
                 <Image src={logo} alt="ChirpChecker Logo" width="auto" height={52} />
            </div>


            {/* Sign-Up Form */}
            <form onSubmit={handleSignup} className="space-y-3">
              <input 
                type="email" 
                placeholder="Enter your email"
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border px-4 py-3 rounded-md text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-800"
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button type="submit" disabled={loading}
                className="w-full bg-green-brand text-white font-semibold py-3 rounded-md hover:bg-green-800 transition">
                {loading ? "Processing..." : "Continue"}
              </button>

              {/* Add Go Back to Login Link */}
              <Link href="/login/">
                <p className="text-input-title text-sm mt-4 w-full text-center">
                  Go Back to <span className="text-green-800 hover:underline">Log In</span>
                </p>
              </Link>
            </form>

            {/* Divider */}
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="flex-shrink mx-4 text-gray-400 text-sm">OR</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            {/* Social Authentication */}
            <div className="space-y-4">
              <button className="w-full flex items-center justify-center border border-neutral-200 rounded-md py-3 hover:bg-gray-100 transition">
                <Image className="mr-2 w-[22px] h-[22px] lg:w-[24px] lg:h-[24px]" src={google} alt="Google" width={24} height={24} />
                Continue With Google
              </button>

              <button className="w-full flex items-center justify-center border border-neutral-200 rounded-md py-3 hover:bg-gray-100 transition">
                <Image className="mr-2 w-[22px] h-[22px] lg:w-[24px] lg:h-[24px]" src={apple} alt="Apple" width={24} height={24} />
                Continue With Apple
              </button>

              <button className="w-full flex items-center justify-center border border-neutral-200 rounded-md py-3 hover:bg-gray-100 transition">
                <Image className="mr-2 w-[22px] h-[22px] lg:w-[24px] lg:h-[24px]" src={facebook} alt="Facebook" width={24} height={24} />
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

export default withAuthProtection(SignupPage, "auth");

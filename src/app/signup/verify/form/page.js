"use client";

import NavbarWrapper from "../../../public_components/NavbarWrapper";
import Footer from "../../../public_components/Footer";
import Image from "next/image";
import checkmark from "../../../../../public/images/sign-ill.png";
import logo from "../../../../../public/images/logo.png";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCookie, setCookie } from 'cookies-next';
import logomob from "../../../../../public/images/logomob.png";
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function FormPage() {
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_AUTH_URL;

  // ✅ Retrieve stored email & OTP
  const email = getCookie("user_email");
  const otp = getCookie("user_otp");

  useEffect(() => {
    document.title = "Provide More Information";
    if (!email || !otp) {
      router.push("/signup/");
    }
  }, [email, otp, router]);

  useEffect(() => {
    if (isSubmitted) {
      router.push("/signup/verify/form/success");
    }
  }, [isSubmitted, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setPasswordError("");

    if (!fullName || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    if (!agreedToTerms) {
      setError("You must agree to the terms & conditions.");
      return;
    }

    setLoading(true);

    try {

      const response = await fetch(`${API_URL}/api/register/verify-otp/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          otp,
          full_name: fullName,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 400) {
          setError("Invalid or expired OTP. Please try again.");
        } else {
          setError(data.detail || "Signup failed. Please try again.");
        }
        setLoading(false);
        return;
      }

      // ✅ Clear stored email & OTP after successful registration
      setCookie("user_email", null, {
        maxAge: 0,
        secure: true,
        sameSite: "Strict"
      });
      setCookie("user_otp", null, {
        maxAge: 0,
        secure: true,
        sameSite: "Strict"
      });

      // ✅ Set state to trigger useEffect for navigation
      setIsSubmitted(true);
    } catch (error) {
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

        {/* Right Side - Details Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-8">
          <div className="max-w-md w-full space-y-6">
            {/* Logo */}
            <div className="flex flex-col items-center mb-9">
                 <Image src={logo} alt="ChirpChecker Logo" width="auto" height={54} className="mb-3.5" />
            </div>

            {/* Details Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <p className="text-md text-center">
                Registering with: <span className="text-green-900">{email}</span>
              </p>

              <div className="space-y-3">
                <p className="text-input-title text-sm">Enter Your Full Name</p>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full border px-4 py-3 rounded-md text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-800"
                  required
                />
              </div>
              <div className="space-y-3">
                <p className="text-input-title text-sm">Create New Password</p>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border px-4 py-3 rounded-md text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-800"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                  </button>
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-input-title text-sm">Re-enter New Password</p>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (e.target.value !== password) {
                        setPasswordError("Passwords do not match.");
                      } else {
                        setPasswordError("");
                      }
                    }}
                    className="w-full border px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-800"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                  </button>
                </div>
                {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
              </div>

              <div className="flex items-center gap-2 mt-4">
                <input
                  type="checkbox"
                  id="terms"
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  checked={agreedToTerms}
                  onChange={() => setAgreedToTerms(!agreedToTerms)}
                />
                <label htmlFor="terms" className="text-input-title text-sm">
                  I Agree to the{" "}
                  <Link href="/terms">
                    <span className="text-blue-800 hover:underline">terms & conditions</span>
                  </Link>
                </label>
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={!agreedToTerms || loading}
                className={`w-full text-white font-semibold py-3 rounded-md transition ${
                  agreedToTerms ? "bg-green-brand hover:bg-green-800" : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                {loading ? "Processing..." : "Continue"}
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

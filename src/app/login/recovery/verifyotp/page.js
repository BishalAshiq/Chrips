"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCookie, setCookie } from "cookies-next";
import NavbarWrapper from "../../../public_components/NavbarWrapper";
import Footer from "../../../public_components/Footer";
import Image from "next/image";
import checkmark from "../../../../../public/images/sign-ill.png";
import logo from "../../../../../public/images/logo.png";
import Link from "next/link";
import { withAuthProtection } from "../../../utils/withAuthProtection";
import logomob from "../../../../../public/images/logomob.png";

function VerifyOTP() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [counter, setCounter] = useState(0); // Timer state
  const [resendDisabled, setResendDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const email = getCookie("reset_email") || "";
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    document.title = "Verify Code";
    if (!email) router.push("/login/recovery/");
  }, [email, router]);

  // Countdown Timer for Resend OTP
  useEffect(() => {
    if (counter > 0) {
      const timer = setInterval(() => {
        setCounter((prev) => {
          if (prev <= 1) {
            setResendDisabled(false); // Enable button when timer ends
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [counter]);

  // 🔄 Resend Code API Call
  const handleResendOTP = async () => {
    setError("");
    setResendDisabled(true);
    setCounter(30); // Start 30-second countdown

    try {
      const response = await fetch(`${API_URL}/api/password/reset-request/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        setResendDisabled(false);
        throw new Error("Failed to resend Code. Please try again.");
      }
    } catch {
      setError("Failed to resend Code. Please try again.");
    }
  };

  // ✅ Verify OTP & Store in Cookies
  const handleOTPVerification = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!otp || otp.length !== 6) {
      setError("Invalid Code. Please enter a valid 6-digit Code.");
      setLoading(false);
      return;
    }

    // Store OTP in cookies before navigating
    setCookie("reset_otp", otp, { secure: true, sameSite: "Strict", maxAge: 600 });

    // Redirect to password reset page
    router.push("/login/recovery/verifyotp/newpass/");
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

        {/* Right Side - OTP Verification Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-8">
          <div className="max-w-md w-full space-y-6">
            {/* Logo */}
            <div className="flex flex-col items-center mb-4">
                 <Image src={logo} alt="ChirpChecker Logo" width="auto" height={54} className="mb-3.5" />
            </div>

            {/* OTP Form */}
            <form onSubmit={handleOTPVerification} className="space-y-3">
              <p className="text-md mb-3 text-center">
                Enter Code sent to <strong className="text-blue-600">{email}</strong>
                <button 
                  onClick={() => router.push("/login/recovery/")}
                  className="block text-green-800 hover:underline mt-1 font-semibold w-full text-center"
                >
                  Change Email
                </button>
              </p>

              <input
                type="text"
                placeholder="Enter Code"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength="6"
                required
                className="w-full border px-4 py-3 text-sm text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-800"
              />

              {error && <p className="text-red-500 text-sm">{error}</p>}

              {/* Verify Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-brand text-white font-semibold py-3 rounded-md hover:bg-green-800 transition"
              >
                {loading ? "Verifying..." : "Verify Now"}
              </button>

              {/* Resend OTP Button Below Verify */}
              <div className="text-center text-sm mt-3">
                {counter > 0 ? (
                  <p className="text-gray-500 text-sm font-semibold">Resend Code in {counter}s</p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    className={`text-green-900 hover:text-green-800 text-sm font-semibold ${
                      resendDisabled ? "cursor-not-allowed text-gray-400" : ""
                    }`}
                    disabled={resendDisabled}
                  >
                    Resend Code
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default withAuthProtection(VerifyOTP, "auth");

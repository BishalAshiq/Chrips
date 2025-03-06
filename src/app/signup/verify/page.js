"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import NavbarWrapper from "../../public_components/NavbarWrapper";
import Footer from "../../public_components/Footer";
import Image from "next/image";
import checkmark from "../../../../public/images/sign-ill.png";
import logo from "../../../../public/images/logo.png";
import Link from "next/link";
import { setCookie, getCookie } from 'cookies-next';
import { withAuthProtection } from "../../utils/withAuthProtection";
import logomob from "../../../../public/images/logomob.png";

function VerifyOTP() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendCount, setResendCount] = useState(0);
  const [timer, setTimer] = useState(30);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [userEmail, setUserEmail] = useState("");

  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_AUTH_URL;

  useEffect(() => {
    document.title = "Verify Email";
    const storedEmail = getCookie("user_email");
    if (storedEmail) {
      setUserEmail(storedEmail);
    } else {
      router.push("/signup/");
    }
  }, [router]);

  useEffect(() => {
    let countdown;
    if (isTimerRunning && timer > 0) {
      countdown = setInterval(() => setTimer((prevTimer) => prevTimer - 1), 1000);
    } else if (timer === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(countdown);
  }, [isTimerRunning, timer]);

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {

      setCookie('user_otp', otp, { secure: true, sameSite: 'Strict', maxAge: 600 });

      // ✅ Redirect to the form page
      router.push("/signup/verify/form/");
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendCount >= 3) {
      setError("Max Code requests reached.");
      return;
    }

    setError("");
    setResendCount(resendCount + 1);
    setTimer(30);
    setIsTimerRunning(true);

    try {
      await fetch(`${API_URL}/api/otp/resend/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail }),
      });
    } catch (err) {
      setError("Failed to resend Code.");
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

        {/* Right Side - OTP Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-8">
          <div className="max-w-md w-full space-y-6">
            {/* Logo - Hidden on mobile */}
            <div className="hidden lg:flex lg:flex-col items-center mb-4">
                 <Image src={logo} alt="ChirpChecker Logo" width="auto" height={54} className="mb-3.5" />
            </div>

            {/* OTP Form */}
            <form onSubmit={handleOTPSubmit} className="space-y-4">
              <p className="text-md text-center">
                We sent a 6-digit code to your email <br />
                <span className="text-green-900">{userEmail}</span>.{" "}
                <Link href="/signup" className="text-[#007BFF] underline">
                  Change Email
                </Link>
              </p>

              <input
                type="text"
                placeholder="Enter Code"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className="w-full border px-4 py-3 rounded-md text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-800"
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-brand text-white py-3 rounded-md hover:bg-green-800 transition"
              >
                {loading ? "Processing..." : "Verify Code"}
              </button>
            </form>

            {/* Resend OTP Section */}
            <p className="text-sm text-center">
              Didn&apos;t receive the code?{" "}
              {isTimerRunning ? (
                <span className="text-gray-500">Resend in {timer}s</span>
              ) : (
                <button
                  onClick={handleResendOTP}
                  disabled={resendCount >= 3}
                  className={`text-[#007BFF] underline ${resendCount >= 3 ? "cursor-not-allowed text-gray-500" : ""
                    }`}
                >
                  Resend
                </button>
              )}
            </p>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default withAuthProtection(VerifyOTP, "auth");

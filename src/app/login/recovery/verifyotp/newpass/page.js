"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next";
import NavbarWrapper from "../../../../public_components/NavbarWrapper";
import Footer from "../../../../public_components/Footer";
import Image from "next/image";
import checkmark from "../../../../../../public/images/sign-ill.png";
import logo from "../../../../../../public/images/logo.png";
import Link from "next/link";
import { withAuthProtection } from "../../../../utils/withAuthProtection";
import logomob from "../../../../../../public/images/logomob.png";

function NewPass() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const email = getCookie("reset_email") || "";
  const otp = getCookie("reset_otp") || "";

  useEffect(() => {
    document.title = "Create New Password";
    if (!email || !otp) {
      router.push("/login/recovery/");
    }
  }, [email, otp, router]);

  const handlePasswordUpdate = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/password/reset-confirm/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, new_password: password }),
      });

      if (!response.ok) {
        setError("Failed to reset password. Please try again.");
        return;
      }

      // Redirect to success page after successful password reset
      router.push("/login/recovery/verifyotp/newpass/resetpass/");
    } catch {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-white overflow-hidden pt-3">
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
            <div className="flex flex-col items-center mb-4">
                 <Image src={logo} alt="ChirpChecker Logo" width="auto" height={54} className="mb-3.5" />
            </div>

            <div className="space-y-3">
              <p className="text-input-title text-sm">Create New Password</p>
              <input
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-800"
              />
            </div>

            <div className="space-y-3">
              <p className="text-input-title text-sm">Re-enter New Password</p>
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-800"
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>

            <button 
              onClick={handlePasswordUpdate}
              className="w-full bg-green-brand hover:bg-green-800 text-white font-semibold py-3 rounded-md transition"
            >
              Continue
            </button>

            <Link href="/login/">
              <p className="text-input-title text-sm mt-4 w-full text-center">
                Go Back to <span className="text-green-800 hover:underline">Sign In</span>
              </p>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default withAuthProtection(NewPass, "auth");

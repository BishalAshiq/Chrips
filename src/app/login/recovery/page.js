"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next";
import NavbarWrapper from "../../public_components/NavbarWrapper";
import Footer from "../../public_components/Footer";
import Image from "next/image";
import checkmark from "../../../../public/images/sign-ill.png";
import logo from "../../../../public/images/logo.png";
import Link from "next/link";
import { withAuthProtection } from "../../utils/withAuthProtection";
import logomob from "../../../../public/images/logomob.png";

function Recovery() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_AUTH_URL;

  useEffect(() => {
    document.title = "Forgot Password";
  }, []);

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!API_URL) throw new Error("🚨 API URL is missing!");

      const response = await fetch(`${API_URL}/api/password/reset-request/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      if (!response.ok) {
        if (response.status === 400) {
          setError("❌ Invalid email. Please check and try again.");
        } else {
          setError(`❌ Error (${response.status}): Unable to process request.`);
        }
        return;
      }

      // ✅ Store email in a secure cookie (valid for 10 minutes)
      setCookie("reset_email", email.trim(), { secure: true, sameSite: "Strict", maxAge: 600 });

      // ✅ Ensure redirect happens after the cookie is set
      setTimeout(() => {
        router.push("/login/recovery/verifyotp/");
      }, 200); // Small delay to ensure cookie is stored

    } catch (error) {
      setError("⚠️ Network Error: Unable to connect. Try again.");
    } finally {
      setLoading(false);
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
            <form onSubmit={handlePasswordReset} className="space-y-3">
              <p className="text-input-title text-sm">Enter your email. We&apos;ll send you a password reset Code.</p>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-800"
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button type="submit" disabled={loading} className="w-full bg-green-brand text-white mt-4 font-semibold py-3 rounded-md hover:bg-green-800 transition">
                {loading ? "Sending Code..." : "Send Code"}
              </button>
            </form>
            <Link href="/login/"><p className="text-input-title text-sm mt-4 w-full text-center">Go Back to <span className="text-green-800 hover:underline">Sign In</span></p></Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default withAuthProtection(Recovery, "auth");

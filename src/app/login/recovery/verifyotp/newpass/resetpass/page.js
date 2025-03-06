"use client";
import { useEffect } from "react";
import Image from "next/image";
import existing_check from "../../../../../../../public/images/existing-check.png";
import Link from "next/link";
import NavbarWrapper from "../../../../../public_components/NavbarWrapper";



export default function ResetPass() {
  useEffect(() => {
    document.title = "You Have Successfully Reset Your Password";
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden pt-3">
      <NavbarWrapper />
      
      <div className="flex-1 flex items-center justify-center" style={{backgroundColor: 'rgba(28, 78, 17, 0.15)'}}>
        <div className="max-w-md w-full space-y-8 p-4">
          <div className="flex flex-col items-center">
            <Image
              src={existing_check}
              alt="Existing Check"
              width="auto" 
              height={180}
            />
          </div>

          <div className="text-center">
            <p className="text-md" style={{color: '#1D203E', fontWeight: 500}}>
            We have reset your password. <br/>
            Please login with your new password.
            </p>


            <Link href="/login">
              <button className="mt-6 w-full bg-green-brand text-white font-semibold py-3 rounded-md hover:bg-green-800 transition">
                Go to Login →
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

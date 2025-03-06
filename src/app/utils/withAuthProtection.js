"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next";
import { jwtDecode } from "jwt-decode";

export function withAuthProtection(WrappedComponent, type = "protected") {
  return function ProtectedRoute(props) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [shouldRender, setShouldRender] = useState(false);
    const [isGuest, setIsGuest] = useState(false);

    useEffect(() => {
      if (type === "guest") {
        setIsGuest(true);
        setShouldRender(true);
        setLoading(false);
        return;
      }

      const checkAuth = () => {
        const token = getCookie("access_token");

        if (type === "auth") {
          // Prevent logged-in users from accessing auth pages
          if (token) {
            try {
              const decoded = jwtDecode(token);
              if (decoded.exp * 1000 > Date.now() && decoded.role === "end_user") {
                router.replace("/dashboard/");
                return;
              }
            } catch (error) {}
          }
          setShouldRender(true);
        } 
        else if (type === "protected") {
          // Allow only authenticated users
          if (!token) {
            router.replace("/login/");
            return;
          }
          try {
            const decoded = jwtDecode(token);
            if (decoded.exp * 1000 <= Date.now() || decoded.role !== "end_user") {
              router.replace("/login/");
              return;
            }
            setShouldRender(true);
          } catch (error) {
            router.replace("/login/");
          }
        }

        setLoading(false);
      };

      checkAuth();
    }, [router]);

    if (loading || !shouldRender) {
      return (
        <div className="h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-900"></div>
        </div>
      );
    }

    return <WrappedComponent {...props} isGuest={isGuest} />;
  };
}

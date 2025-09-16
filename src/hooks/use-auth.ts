
"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

const PUBLIC_PATHS = ['/login', '/signup'];

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // In a real app, this would be a check for a valid session token
    const storedUsername = localStorage.getItem("username");
    
    if (storedUsername) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      // Redirect to login page if not authenticated and not on a public page
      if (!PUBLIC_PATHS.includes(pathname)) {
        router.push("/login");
      }
    }
    setIsLoading(false);
  }, [pathname, router]);

  return { isAuthenticated, isLoading };
}

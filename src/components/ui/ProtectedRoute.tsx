
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

// Try to import from Crossmint first, fallback to our mock implementation
let useAuth: any;
try {
  useAuth = require("@crossmint/client-sdk-react-ui").useAuth;
} catch (e) {
  useAuth = require("@/context/AuthContext").useAuth;
}

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // After component mounts, consider auth check completed
    // This prevents initial flashing of redirect
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  // While loading, show nothing to prevent flash
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  // If no user and not loading, redirect to home
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // User is authenticated, render the protected content
  return <>{children}</>;
};

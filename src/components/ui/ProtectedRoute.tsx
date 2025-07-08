
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // After component mounts, consider auth check completed
    // This prevents initial flashing of redirect
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  // Show loading spinner while auth is loading
  if (loading || isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  // If no user and not loading, redirect to auth
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // User is authenticated, render the protected content
  return <>{children}</>;
};

import React from "react";
import { useAuth } from "../auth/authcontext";
import { useRouter } from "next/router";

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, token } = useAuth();
  const router = useRouter();

  if (!token || !user) {
    // Redirect to login if not authenticated
    if (typeof window !== "undefined") {
      router.push("/user/signIn");
    }
    return null;
  }

  return <>{children}</>;
};

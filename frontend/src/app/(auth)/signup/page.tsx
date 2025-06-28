'use client';

import { useAuth } from "@/contexts/AuthContext";
import SignUpForm from "@/ui/auth/SignUpForm";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const SignUpPage = () => {

  const { isLoggedIn, isLoading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;

    if (isLoggedIn) {
      router.push('/profile');
    }
  },
    [isLoggedIn, authLoading, router]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[--background] text-[--foreground]">
        <p>Loading registration page...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[--background] text-[--foreground]">
      <SignUpForm />
    </div>
  );
};

export default SignUpPage;
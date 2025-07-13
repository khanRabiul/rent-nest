"use client";

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

import ProfileInfo from '@/ui/user/ProfileInfo';
import ProfileSidebar from '@/ui/user/ProfileSidebar';

export default function ProfilePage() {
  const { user, isLoggedIn, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (authLoading) return;
    if (!isLoggedIn) {
      router.push('/signin');
    }
  }, [isLoggedIn, authLoading, router]);

  if (authLoading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center bg-[--background] text-[--foreground]">
        <p>Loading your profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center bg-[--background] text-[--foreground]">
        <p className="text-red-500">Please sign in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 bg-[--background] text-[--foreground]">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8 text-[--primary]">My Profile</h1>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Menu */}
          <ProfileSidebar user={user} toggleMobileMenu={() => { }} />

          {/* Content Area*/}
          <main className="flex-1 bg-[--card-bg] p-6 rounded-lg shadow-md border border-[--border]">
            <h2 className="text-2xl font-semibold mb-4 text-[--foreground]">Personal Info</h2>
            <ProfileInfo user={user} />
          </main>
        </div>
      </div>
    </div>
  );
}
'use client';

import { IFrontendUser } from "@/contexts/AuthContext";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface ProfileSidebarProps {
  user: IFrontendUser;
  toggleMobileMenu?: () => void;
}

const ProfileSidebar = ({ toggleMobileMenu }: ProfileSidebarProps) => {

  const pathname = usePathname();

  return (
    <aside className="w-full md:w-64 bg-[--card-bg] p-6 rounded-lg shadow-md border border-[--border]">
      <h2 className="text-xl font-semibold mb-4 text-[--foreground]">Profile Menu</h2>
      <nav className="flex flex-col gap-2">
        <Link href="/profile" className={`py-2 px-3 rounded-md hover:bg-[--bg-light] ${pathname === '/profile' ? 'bg-[--primary] text-white' : ''}`} onClick={toggleMobileMenu}>
          Profile Info
        </Link>
        <Link href="/profile/edit" className={`py-2 px-3 rounded-md hover:bg-[--bg-light] ${pathname === '/profile/edit' ? 'bg-[--primary] text-white' : ''}`} onClick={toggleMobileMenu}>
          Edit Profile
        </Link>
        <Link href="/profile/saved-properties" className={`py-2 px-3 rounded-md hover:bg-[--bg-light] ${pathname === '/profile/saved-properties' ? 'bg-[--primary] text-white' : ''}`} onClick={toggleMobileMenu}>
          Saved Properties
        </Link>
      </nav>
    </aside>
  );
};

export default ProfileSidebar;
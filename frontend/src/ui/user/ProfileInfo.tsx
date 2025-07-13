'use client'

import { IFrontendUser } from "@/contexts/AuthContext";
import Image from "next/image";


interface ProfileInfoProps {
  user: IFrontendUser;
}

const ProfileInfo = ({ user }: ProfileInfoProps) => {
  return (
    <div className="bg-[--card-bg] p-6 rounded-lg shadow-md border border-[--border]">
      <h2 className="text-2xl font-semibold mb-4 text-[--foreground]">Your Info.</h2>

      {
        user.profilePicture ? (
          <Image src={user.profilePicture} alt="profile picture" width={100} height={100} className="rounded-full object-cover mb-4" />
        ) : (
          <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold text-2xl mb-4">
            {user.fullName ? user.fullName.charAt(0).toUpperCase() : (user.username ? user.username.charAt(0).toUpperCase() : '')}
          </div>
        )
      }

      <p><strong>User Name:</strong> {user.username}</p>
      <p><strong>User Email:</strong> {user.email}</p>
      <p><strong>User Full Name:</strong> {user.fullName || 'N/A'}</p>
      <p><strong>User Role:</strong> {user.role}</p>


    </div>
  );
};

export default ProfileInfo;
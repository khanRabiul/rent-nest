'use client';

import Image from 'next/image';
import Link from 'next/link';
import InquiryForm from '@/ui/components/inquiries/InquiryForm';
import { IPropertyResponse } from '@/types/property';
import { useAuth } from '@/contexts/AuthContext';

interface LandlordInfoProps {
  property: IPropertyResponse;
}

const LandlordInfo = ({ property }: LandlordInfoProps) => {
  const { user, isLoggedIn } = useAuth();

  return (
    <div className="md:col-span-1 bg-[--card-bg] p-6 rounded-lg shadow-md border border-[--border]">
      <h2 className="text-2xl font-semibold mb-4 text-[--foreground]">Landlord Information</h2>
      {property.landlord ? (
        <div className="flex items-center gap-4 mb-4">
          {property.landlord.profilePicture ? (
            <Image
              src={property.landlord.profilePicture}
              alt="Landlord Profile"
              width={50}
              height={50}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold text-lg">
              {property.landlord.fullName
                ? property.landlord.fullName.charAt(0).toUpperCase()
                : (property.landlord.username?.charAt(0).toUpperCase() ?? '')}
            </div>
          )}
          <div>
            <p className="font-semibold text-[--foreground]">
              {property.landlord.fullName || property.landlord.username}
            </p>
            <p className="text-sm text-[--foreground-muted]">Role: {property.landlord.role}</p>
          </div>
        </div>
      ) : (
        <p className="text-[--foreground-muted] text-sm mb-4">Landlord details not available.</p>
      )}

      {isLoggedIn && user && property.landlord ? (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-3 text-[--foreground]">Message Landlord</h3>
          <InquiryForm landlordId={property.landlord._id as string} propertyId={property._id} />
        </div>
      ) : (
        <p className="mt-6 text-[--foreground-muted] text-sm">
          To message Landlord <Link href="/signin" className="text-[--primary] hover:underline">Log In</Link>.
        </p>
      )}
    </div>
  );
};

export default LandlordInfo;

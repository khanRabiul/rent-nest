'use client';

import { IPropertyResponse } from '@/types/property';

interface LocationProps {
  property: IPropertyResponse;
}

const Location = ({ property }: LocationProps) => {
  const { coordinates } = property.location || {};
  return (
    <div className="bg-[--card-bg] p-6 rounded-lg shadow-md border border-[--border] mt-8">
      <h2 className="text-2xl font-bold mb-4 text-[--primary]">Location</h2>
      {coordinates ? (
        <>
          <p className="text-[--foreground-muted] mb-2">
            Coordinates: {coordinates.latitude}, {coordinates.longitude}
          </p>
          <div className="h-[300px] w-full rounded-lg overflow-hidden">
            {/* Replace this with an actual map embed or component later */}
            <iframe
              width="100%"
              height="100%"
              loading="lazy"
              className="rounded-lg"
              src={`https://maps.google.com/maps?q=${coordinates.latitude},${coordinates.longitude}&z=15&output=embed`}
            />
          </div>
        </>
      ) : (
        <p className="text-[--foreground-muted]">Location data is not available.</p>
      )}
    </div>
  );
};

export default Location;

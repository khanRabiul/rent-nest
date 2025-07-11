'use client'

import { MapPin, Tag, Currency, Wallet, Bed, Bath, DoorOpen, Lightbulb, CheckCircle } from 'lucide-react';

import { IPropertyResponse } from '@/types/property';

interface PropertyDetailsInfoProps {
  property: IPropertyResponse;
}

const PropertyInfo = ({ property }: PropertyDetailsInfoProps) => {
  return (
    <div className="md:col-span-2 bg-[--card-bg] p-6 rounded-lg shadow-md border border-[--border]">
      <h2 className="text-2xl font-semibold mb-4 text-[--foreground]">Details</h2>
      <p className="text-[--foreground-muted] mb-4 leading-relaxed">{property.description}</p>

      <div className="grid grid-cols-2 gap-4 text-[--foreground-muted] text-base mb-4">
        <div className="flex items-center gap-2"><MapPin size={20} /> {property.location.address}, {property.location.city}, {property.location.country}</div>
        <div className="flex items-center gap-2"><Tag size={20} /> {property.propertyType}</div>
        <div className="flex items-center gap-2"><Currency size={20} /> ৳{property.price.toLocaleString()}/month</div>
        {property.advancePayment && property.advancePayment > 0 && (
          <div className="flex items-center gap-2"><Wallet size={20} /> Advance: ৳{property.advancePayment.toLocaleString()}</div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 text-[--foreground-muted] text-base">
        {property.bedrooms !== undefined && property.bedrooms !== null && (
          <div className="flex items-center gap-1">
            <Bed size={20} /> {property.bedrooms} Bedrooms
          </div>
        )}
        {property.bathrooms !== undefined && property.bathrooms !== null && (
          <div className="flex items-center gap-1">
            <Bath size={20} /> {property.bathrooms} Bathrooms
          </div>
        )}
        {property.livingRooms !== undefined && property.livingRooms !== null && property.livingRooms > 0 && (
          <div className="flex items-center gap-1">
            <DoorOpen size={20} /> {property.livingRooms} Living Rooms
          </div>
        )}
        {property.hasWindows && (
          <div className="flex items-center gap-2"><Lightbulb size={20} /> Has Windows</div>
        )}
      </div>

      {property.amenities && property.amenities.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-3 text-[--foreground]">Amenities</h3>
          <ul className="grid grid-cols-2 gap-2 text-[--foreground-muted]">
            {property.amenities.map((amenity, index) => (
              <li key={index} className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-500" /> {amenity}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PropertyInfo;

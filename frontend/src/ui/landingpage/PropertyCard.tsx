'use client';

import { IPropertyResponse } from "@/types/property";
import Image from "next/image";
import Link from "next/link";

interface IPropertyCardProps {
  property: IPropertyResponse;
}

const PropertyCard = ({ property }: IPropertyCardProps) => {

  if (!property) {
    return null;
  };


  return (
    <div
      className="bg-[--card-bg] rounded-lg shadow-lg overflow-hidden border border-[--card-border] hover:shadow-xl transition-shadow duration-300"
    >
      <Link href={`/properties/${property._id}`} passHref>
        <div className="relative w-full h-48 sm:h-56 bg-gray-200">
          <Image
            src={property.images[0] || '/images/property/property_placeholder.jpg'}
            alt={property.title}
            fill={true}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ objectFit: 'cover' }}
            className="transition-transform duration-300 hover:scale-105"
          />
        </div>

        <div className="p-4">
          <h3 className="text-xl font-semibold text-[--foreground] truncate mb-2" title={property.title}>{property.title}</h3>
          <p className="text-[--foreground-muted] text-sm mb-3" >
            {property.location.address}, {property.location.city}
          </p>
          <div className="flex items-center justify-between text-[--foreground-muted] text-sm mb-3">
            <span className="bg-[--bg-light] px-2 py-1 rounded-full text-xs font-medium">{property.propertyType}</span>
            <span className="text-lg font-bold text-[--primary]">{property.price.toLocaleString()}</span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default PropertyCard;
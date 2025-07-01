'use client';

import propertyService from "@/services/propertyService";
import { IPropertyResponse } from "@/types/property";
import PropertyCard from "@/ui/landingpage/PropertyCard";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const SavedPropertiesPage = () => {

  const [properties, setProperties] = useState<IPropertyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const propertyTypeFilter = searchParams.get('type');
  const locationFilter = searchParams.get('location');

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError(null);

        const params: { type?: string; location?: string } = {};

        if (propertyTypeFilter) {
          params.type = propertyTypeFilter;
        }

        if (locationFilter) {
          params.location = locationFilter;
        }

        const response = await propertyService.getAllProperties(params);
        setProperties(response.properties);

      } catch (error: any) {
        console.error('Failed to fetch properites:', error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProperties();
  },
    [propertyTypeFilter, locationFilter]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center bg-[--background] text-[--foreground]">
        <p>Loading properties...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center bg-[--background] text-[--foreground]">
        <p>Error: {error}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 bg-[--background] text-[--foreground]">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8 text-[--primary]"></h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {properties.map((property) => (
            <PropertyCard key={property._id} property={property} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SavedPropertiesPage;
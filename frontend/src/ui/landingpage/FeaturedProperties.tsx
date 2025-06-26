'use client';

import propertyService from "@/services/propertyService";
import { useEffect, useState } from "react";
import PropertyCard from "./PropertyCard";
import Link from "next/link";

const FeaturedProperties = () => {

  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedProperties = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await propertyService.getAllProperties({ limit: 8, sort: '-createdAt' });
        setFeaturedProperties(response.properties);
      } catch (error: any) {
        console.error('Failed to fetch featured properties:', error.response?.data || error.message);
        setError(error.response?.data?.message || 'Failed to fetch featured propertites');
      } finally {
        setLoading(false);
      }
    }
    fetchFeaturedProperties();
  },
    []);

  if (loading) {
    return (
      <section className="py-12 bg-[--background] text-[--foreground]">
        <div className="container text-center">
          <p>Properties Loading...</p>
        </div>
      </section>
    )
  };

  if (error) {
    return (
      <section className="py-12 bg-[--background] text-center">
        <div className="container text-center">
          <p className="text-red-500">Error: {error}</p>
        </div>
      </section>
    )
  };

  if (featuredProperties.length === 0) {
    return (
      <section className="py-12 bg-[--background] text-[--foreground]">
        <div className="conteiner text-center">
          <h2 className="text-2xl font-bold mb-6">
            Your featured properties will appear here soon!
          </h2>
          <p>No Featured Properties Available</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 bg-[--background] text-[--foreground]">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-10 text-[--primary]">Your Properties </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {featuredProperties.map((property) => (
            <PropertyCard key={property._id} property={property} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href='/properties'
            className="px-8 py-3 rounded-md bg-[--primary] text-white font-semibold text-lg hover:opacity-90 transition-opacity duration-200"
          >
            See All Properties
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;
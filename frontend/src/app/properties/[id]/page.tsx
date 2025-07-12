"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import propertyService from '@/services/propertyService';
import { IPropertyResponse } from '@/types/property';
import { useAuth } from '@/contexts/AuthContext';
import userServices from '@/services/userServices';
import { Heart, Bed, Bath, DoorOpen, MapPin, Tag, Currency, Wallet, Lightbulb, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import InquiryForm from '@/ui/components/inquiries/InquiryForm';
import PropertyImageGallery from '@/ui/PropertyImageGallery';
import Location from '@/ui/properties/Location';
import LandlordInfo from '@/ui/properties/LandlordInfo';
import PropertyInfo from '@/ui/properties/PropertyInfo';

export default function PropertyDetailsPage() {
  const { id } = useParams();
  const [property, setProperty] = useState<IPropertyResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user, isLoggedIn, isLoading: authLoading } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchPropertyDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await propertyService.getSingleProperty(id as string);
        setProperty(response.property);

        if (!authLoading && isLoggedIn && user && user.savedProperties) {
          setIsSaved(user.savedProperties.some((savedId: string) => savedId === response.property._id));
        }

      } catch (err: any) {
        console.error('Failed to fetch property details:', err.response?.data || err.message);
        setError(err.response?.data?.message || 'Failed to load property details.');
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyDetails();
  }, [id, isLoggedIn, user, authLoading]);

  const handleSaveToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn) {
      alert('Please log in to save properties!');
      return;
    }
    if (!user || !user.id) {
      alert('User information not found. Please try logging in again.');
      return;
    }
    if (isSaving) return;

    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Your session has expired. Please log in again.');
        return;
      }

      const response = await userServices.saveToggleProperty(property!._id, token);
      setIsSaved(response.saved);
      alert(response.message);

    } catch (error) {
      console.error('Failed to toggle save property:', error);
      alert('Failed to save/unsave property.');
    } finally {
      setIsSaving(false);
    }
  };


  if (loading || authLoading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center bg-[--background] text-[--foreground]">
        <p>Loading property details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center bg-[--background] text-[--foreground]">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center bg-[--background] text-[--foreground]">
        <p>Property not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 bg-[--background] text-[--foreground]">
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-[--primary]">{property.title}</h1>
          <button
            onClick={handleSaveToggle}
            className={`p-3 rounded-full bg-[--bg-light] border border-[--border] text-[--primary] ${isSaved ? 'text-red-500' : 'text-gray-500'} hover:scale-110 transition-transform duration-200`}
            aria-label={isSaved ? "Unsave property" : "Save property"}
            title={isSaved ? "Unsave" : "Save"}
            disabled={isSaving}
          >
            <Heart size={28} fill={isSaved ? 'currentColor' : 'none'} />
          </button>
        </div>

        <PropertyImageGallery images={property.images} title={property.title} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          <div className="md:col-span-2 space-y-6">
            <PropertyInfo property={property} />

          </div>
          <div>
            <LandlordInfo property={property} />
          </div>
        </div>
        <Location property={property} />
      </div>
    </div>
  );
}
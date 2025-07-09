"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation'; 
import propertyService from '@/services/propertyService'; 
import { IPropertyResponse } from '@/types/property'; 
import { useAuth } from '@/contexts/AuthContext'; 
// import userService from '@/services/userService'; 
import { Heart, Bed, Bath, DoorOpen, MapPin, Tag, Currency, Wallet, Lightbulb, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link'; 
import InquiryForm from '@/ui/components/inquiries/InquiryForm';

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
    if(isSaving) return;

    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Token not found. Please log in again.');
        return;
      }
      const response = await userService.saveToggleProperty(property!._id, token); 
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

        <div className="relative w-full h-[500px] bg-gray-200 rounded-lg overflow-hidden mb-8">
          <Image
            src={property.images[0] || '/images/property/property_placeholder.jpg'}
            alt={property.title}
            fill={true}
            style={{ objectFit: 'cover' }}
            sizes="100vw"
          />
          {property.images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
              {property.images.map((imgUrl, index) => (
                <div key={index} className="w-16 h-12 bg-white/50 backdrop-blur-sm rounded-md cursor-pointer flex items-center justify-center">
                  <Image src={imgUrl} alt={`Thumbnail ${index}`} width={50} height={30} objectFit="cover" className="rounded-md" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
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
                <div className="flex items-center gap-2"><Bed size={20} /> {property.bedrooms} Bedrooms</div> 
              )}
              {property.bathrooms !== undefined && property.bathrooms !== null && (
                <div className="flex items-center gap-2"><Bath size={20} /> {property.bathrooms} Bathrooms</div> 
              )}
              {property.livingRooms !== undefined && property.livingRooms !== null && property.livingRooms > 0 && (
                <div className="flex items-center gap-2"><DoorOpen size={20} /> {property.livingRooms} Living Rooms</div> 
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

          <div className="md:col-span-1 bg-[--card-bg] p-6 rounded-lg shadow-md border border-[--border]">
            <h2 className="text-2xl font-semibold mb-4 text-[--foreground]">Landlord Information</h2> 
            {property.landlord && ( 
              <div className="flex items-center gap-4 mb-4">
                <div>
                  <p className="font-semibold text-[--foreground]">{property.landlord}</p> 
                  <p className="text-sm text-[--foreground-muted]">Role: Landlord</p> 
                </div>
              </div>
            )}
            
            {isLoggedIn && user && (
              <div className="mt-6">
                <h3 className="text-xl font-semibold mb-3 text-[--foreground]">Message Landlord</h3> 
                <InquiryForm landlordId={property.landlord as string} propertyId={property._id} /> 
              </div>
            )}
            {!isLoggedIn && (
              <p className="mt-6 text-[--foreground-muted] text-sm">
                To message Landlord <Link href="/signin" className="text-[--primary] hover:underline">Log In</Link>.
              </p>
            )}
          </div>
        </div>

      
        {property.location.coordinates && (
          <div className="bg-[--card-bg] p-6 rounded-lg shadow-md border border-[--border] mt-8">
            <h2 className="text-2xl font-bold mb-4 text-[--primary]">Location</h2> 
            <p className="text-[--foreground-muted]">Map will load here: {property.location.coordinates.latitude}, {property.location.coordinates.longitude}</p> 
          </div>
        )}
      </div>
    </div>
  );
}
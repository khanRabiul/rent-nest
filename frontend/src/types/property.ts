export interface IPropertyData {
  title: string;
  description: string;
  price: number;
  currency?: string;
  location: {
    address: string;
    city: string;
    zipCode: string;
    country: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };

  };
  propertyType: 'Apartment' | 'House' | 'Condo' | 'Room' | 'Shop' | 'Office' | 'Other';
  bedrooms: number;
  bathrooms: number;
  livingRooms?: number;
  areaSqFt?: number;
  images: string[];
  amenities?: string[];
  isPublished?: boolean;
  status?: 'Available' | 'Rented' | 'Under Offer';
  advancePayment?: number;
  hasWindows?: boolean;
}
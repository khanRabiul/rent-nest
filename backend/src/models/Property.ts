import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProperty extends Document {
  landlord: mongoose.Types.ObjectId; 
  title: string;
  description: string;
  price: number;
  currency?: string; 
  location: { 
    address: string;
    city: string;
    zipCode?: string;
    country: string; 
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  propertyType: 'Apartment' | 'House' | 'Sublet' | 'Condo' | 'Room' | 'Shop' | 'Office' | 'Other'; 
  bedrooms?: number; 
  bathrooms: number; 
  livingRooms?: number; 
  areaSqFt?: number;
  images: string[]; 
  amenities?: string[];
  isPublished: boolean; 
  status: 'Available' | 'Rented' | 'Under Offer'; 
  advancePayment?: number; 
  hasWindows?: boolean; 
  createdAt: Date;
  updatedAt: Date;
}

const PropertySchema: Schema<IProperty> = new Schema({
  landlord: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: [true, 'Property must have a landlord'],
  },
  title: {
    type: String,
    required: [true, 'Property title is required'],
    trim: true,
    minlength: [5, 'Title must be at least 5 characters long'], 
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Property description is required'],
    trim: true,
    minlength: [20, 'Description must be at least 20 characters long']
  },
  price: {
    type: Number,
    required: [true, 'Rent price is required'],
    min: [0, 'Rent price cannot be negative']
  },
  currency: {
    type: String,
    default: 'BDT' 
  },
  location: { 
    address: {
      type: String,
      required: [true, 'Property address is required'],
      trim: true
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true
    },
    zipCode: {
      type: String,
      trim: true
    },
    country: {
      type: String,
      default: 'Bangladesh', 
      trim: true
    },
    coordinates: {
      latitude: {
        type: Number,
        default: null
      },
      longitude: {
        type: Number,
        default: null
      }
    }
  },
  propertyType: {
    type: String,
    enum: ['Apartment', 'House', 'Sublet', 'Condo', 'Room', 'Shop', 'Office', 'Other'],
    required: [true, 'Property type is required']
  },
  bedrooms: {
    type: Number,
    min: 0,
    default: 0
  },
  bathrooms: {
    type: Number,
    min: 0,
    required: [true, 'Number of bathrooms is required']
  },
  livingRooms: {
    type: Number,
    min: 0,
    default: 0
  },
  areaSqFt: {
    type: Number,
    min: 0
  },
  images: [{ 
    type: String,
    required: [true, 'At least one image is required']
  }],
  amenities: [{ 
    type: String
  }],
  isPublished: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['Available', 'Rented', 'Under Offer'],
    default: 'Available'
  },
  advancePayment: {
    type: Number,
    min: 0,
    default: 0
  },
  hasWindows: { 
    type: Boolean,
    default: false
  }
}, {
  timestamps: true 
});

const Property: Model<IProperty> = mongoose.model<IProperty>('Property', PropertySchema);
export default Property;
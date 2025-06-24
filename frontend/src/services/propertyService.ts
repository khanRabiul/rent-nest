import axios from 'axios';
import { IPropertyData } from '@/types/property';


const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const propertyService = {
  getAllProperties: async (params = {}) => {
    const response = await axios.get(`${API_BASE_URL}/properties`, { params });
    return response.data;
  },

  getSingleProperty: async (id: string) => {
    const response = await axios.get(`${API_BASE_URL}/properties/${id}`);
    return response.data;
  },


  getPropertyTypes: async () => {
    const response = await axios.get(`${API_BASE_URL}/properties/types`);
    return response.data.types;
  },

  createProperty: async (propertyData: IPropertyData, token: string) => {
    const response = await axios.post(`${API_BASE_URL}/properties`, propertyData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },

  updateProperty: async (id: string, propertyData: Partial<IPropertyData>, token: string) => {
    const response = await axios.put(`${API_BASE_URL}/properties/${id}`, propertyData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  }
}

export default propertyService;
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const userServices = {

  // Save/ Unsave property
  saveToggleProperty: async (propertyId: string, token: string) => {
    const response = await axios.put(`${API_BASE_URL}/users/saved-properties/${propertyId}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },

  // Saved Properties
  getSavedProperties: async (token: string) => {
    const response = await axios.get(`${API_BASE_URL}/users/saved-properties`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },

  // Blocked/ Unblocked users by admin
  blockUser: async (userId: string, isBlocked: boolean, token: string) => {
    const response = await axios.put(`${API_BASE_URL}/users/${userId}/block`, {isBlocked}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  }

};

export default userServices;
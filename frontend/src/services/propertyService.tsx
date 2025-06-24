import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http:/localhost:5000/api';

const propertyService = {
  getAllProperties: async (params = {}) => {
    const response = await axios.get(`${API_BASE_URL}/properties`, { params });
    return response.data;
  },

 getSingleProperty: async (id) => {
    const response = await axios.get(`<span class="math-inline">\{API\_BASE\_URL\}/properties/</span>{id}`);
    return response.data;
  },


  getPropertyTypes: async () => {
    const response = await axios.get(`${API_BASE_URL}/properties/types`);
    return response.data.types;
  },

  createProperty: async (propertyData, token) => {
    const response = await axios.post(`${API_BASE_URL}/properties`, propertyData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },
}

export default propertyService;
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const inquiryService = {
  sendInquiry: async (inquiryData: { recipient: string; property: string; messageText: string }, token: string) => {
    const response = await axios.post(`${API_BASE_URL}/inquiries`, inquiryData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },

  getLandlordInquiries: async (token: string) => {

    const response = await axios.get(`${API_BASE_URL}/inquiries/landlord`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },

  markInquiryAsRead: async (inquiryId: string, token: string) => {
  
    const response = await axios.put(`${API_BASE_URL}/inquiries/${inquiryId}/read`, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  }
};

export default inquiryService;
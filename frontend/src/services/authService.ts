import axios from 'axios';
import { IRegisterData, ILoginCredentials } from '@/types/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';


const authService = {
  register: async (userData: IRegisterData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Registration failed!' };
    }
  },
  
  login: async (credentials: ILoginCredentials) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Login failed!' };
    }
  }
};

export default authService;
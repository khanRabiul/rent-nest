export interface IRegisterData {
  username: string;
  email: string;
  password: string;
  role: 'user' | 'landlord' | 'admin';
  fullName: string;
}

export interface ILoginCredentials {
  email: string;
  password: string;
}
import jwt from 'jsonwebtoken';
import { IUser } from '../models/Users';

const jwtSecret = process.env.JWT_SECRET as string;

if(!jwtSecret) {
  console.error('FATAL: JWT_SECRET is not defined');
  process.exit(1);
}

export const generateToken = (user: IUser): string => {
  const payload = {
    id: user._id,
    role: user.role,
  };
  const token = jwt.sign(payload, jwtSecret, {expiresIn: '1h'});
  return token;
};

export const verifyToken = (token: string): any => {
  return jwt.verify(token, jwtSecret);
}


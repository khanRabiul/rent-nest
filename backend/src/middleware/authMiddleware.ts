import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import User, { IUser } from '../models/Users';

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      if (!token) {
        return res.status(401).json({ message: 'Not authorized, token is missing.' });
      }

      const decoded: any = verifyToken(token);

      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return res.status(401).json({ message: 'User not found for this token.' });
      }

      req.user = user;

      next();

    } catch (error: any) {
      console.error('Authentication Error:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed or expired.' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token or invalid format.' });
  }
};


export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ message: 'Access denied, user role not found.' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: `Access denied, role (${req.user.role}) is not authorized to access this route.` });
    }

    next();
  };
};
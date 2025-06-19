import { Router, Request, Response } from "express";
import User from "../models/Users";
import { generateToken } from "../utils/jwt";


const router = Router(); 

router.post('/register', async (req: Request, res: Response) => {
  try {
    const { username, email, password, role, fullName } = req.body;

    if (!username || !email || !password || !role) {
      return res.status(400).json({ message: 'Please enter all required fields: username, email, password, role.' });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(409).json({ message: 'User with this email or username already exists.' });
    }

    const newUser = await User.create({
      username,
      email,
      password,
      role: role || 'user',
      fullName: fullName || null,
    });

    const token = generateToken(newUser);

    res.status(201).json({
      message: 'User registered successfully!',
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        fullName: newUser.fullName, 
        profilePicture: newUser.profilePicture, 
      },
      token,
    });

  } catch (error: any) {
    console.error('Registration Error:', error.message);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val: any) => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server error during registration.', error: error.message });
  }
});

export default router;
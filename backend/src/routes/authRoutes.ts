import { Router, Request, Response } from "express";
import User from "../models/Users";
import { generateToken } from "../utils/jwt";

const router = Router();

router.post('/register', async (req: Request, res: Response) => {
  try {
    const { username, email, password, role } = req.body;
    if (!username || !email || !password || !role) {
      return res.status(400).json({ message: 'Please enter all required fields.' });
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
    });

    const token = generateToken(newUser);

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
      token,
    });
  } catch (error: any) {
    console.error('Registration Error:', error.message);
    res.status(500).json({ message: 'Server error during registration', error: error.message });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please enter both email and password' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid email.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    if (user.isBlocked) {
      return res.status(403).json({ message: 'Your account is blocked.' });
    }

    const token = generateToken(user);

    res.status(200).json({
      message: 'Logged in successfully!',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error: any) {
    console.error('Login Error:', error.message);
    res.status(500).json({ message: 'Server error during login', error: error.message });
  }
});

export default router;
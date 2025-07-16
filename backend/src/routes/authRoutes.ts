import { Router, Request, Response } from "express";
import User from "../models/Users";
import { generateToken } from "../utils/jwt";
import bcrypt from "bcrypt";

const router = Router();

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Please enter both email and password.' });
    }

    const user = await User.findOne({ email });

    if (!user || !user.password) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = generateToken(user);

    res.status(200).json({
      message: 'Login successful!',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        fullName: user.fullName,
        profilePicture: user.profilePicture,
        savedProperties: user.savedProperties,
      },
      token,
    });
  } catch (error: any) {
    console.error('Login Error:', error.message);
    res.status(500).json({ message: 'Server error during login.', error: error.message });
  }
});

// POST /api/auth/register
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
        savedProperties: newUser.savedProperties,
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
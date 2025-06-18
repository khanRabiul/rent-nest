import { Router, Request, Response } from "express";
import { protect, authorizeRoles } from "../middleware/authMiddleware";
import User from "../models/Users";
import cloudinary from "../config/cloudineryConfig";

const router = Router()

// update profile info
router.put(
  '/profile',
  protect,
  async (req: Request, res: Response) => {
    try {
      const userId = req.user?._id;
      const updates = req.body;

      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized user' });
      }

      delete updates.email;
      delete updates.password;
      delete updates.role;
      delete updates.isBlocked;
      delete updates.savedProperties;

      const user = await User.findByIdAndUpdate(userId, updates, { new: true, runValidators: true }).select('-password');

      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }

      res.status(200).json({
        message: 'Profile updated successfully',
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          fullName: user.fullName,
          profilePicture: user.profilePicture,
          isBlocked: user.isBlocked,
        }
      })

    } catch (error: any) {
      console.error('Update Profile Error:', error.message);

      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map((val: any) => val.message);
        return res.status(400).json({ message: messages.join(', ') });
      }

      res.status(500).json({ message: 'Server error during profile update', error: error.message });
    }
  }
)

// update profile picture

router.put(
  '/profile-picture',
  protect,
  async (req: Request, res: Response) => {
    try {
      const userId = req.user?._id;
      const { profilePictureUrl } = req.body;

      if (!userId) {
        return res.status(401).json({
          message: 'User not authenticated.',
        });
      }

      if (!profilePictureUrl) {
        return res.status(400).json({
          message: 'Profile picture URL is required.',
        })
      }

      let user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      user.profilePicture = profilePictureUrl;
      await user.save();

      res.status(200).json({
        message: 'Profile picture updated successfully!',
        profilePicture: user.profilePicture,
      });

    } catch (error: any) {
      console.error('Update Profile Picture Error:', error.message);
      res.status(500).json({message: 'Server error during profile picture update', error: error.message})
    }
  }
)


import { Router, Request, Response } from "express";
import mongoose from "mongoose";
import { protect, authorizeRoles } from "../middleware/authMiddleware";
import User from "../models/Users";
import cloudinary from "../config/cloudineryConfig";
import Property from "../models/Property";

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
      res.status(500).json({ message: 'Server error during profile picture update', error: error.message })
    }
  }
)

// user blocked route by admin
router.put(
  '/:id/block',
  protect,
  authorizeRoles('admin'),
  async (req: Request, res: Response) => {
    try {
      const userIdToBlock = req.params.id;
      const { isBlocked } = req.body;

      const user = await User.findById(userIdToBlock);

      if (!user) {
        return res.status(404).json({ message: 'User not found.' })
      }

      if ((user._id as mongoose.Types.ObjectId).toString() === req.user?._id?.toString()) {
        return res.status(403).json({ message: 'Admin cannot block themselves.' })
      }

      user.isBlocked = isBlocked;
      await user.save();

      res.status(200).json({
        message: `User ${user.username} has been ${isBlocked ? 'blocked' : 'unblocked'} successfully!`,
        user: { id: user._id, username: user.username, isBlocked: user.isBlocked }
      });


    } catch (error: any) {
      console.error('Block User Error:', error.message);
      if (error.name === 'CastError') {
        return res.status(400).json({ message: 'Invalid User ID format' })
      }
      res.status(500).json({ message: 'Server error during user block/unblock.', error: error.message })
    }
  }
);

// add/remove saved property
router.put(
  '/saved-properties/:propertyId',
  protect,
  async (req: Request, res: Response) => {
    try {
      const userId = req.user?._id;
      const propertyId = req.params.propertyId;

      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized user. Please log in.' });
      }

      const propertyExists = await Property.findById(propertyId);
      if (!propertyExists) {
        return res.status(404).json({ message: 'Property not found.' });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }

      const isAlreadySaved = user.savedProperties.includes(new mongoose.Types.ObjectId(propertyId));

      if (isAlreadySaved) {
        user.savedProperties = user.savedProperties.filter(
          (id) => id.toString() !== propertyId.toString()
        );
        await user.save();
        return res.status(200).json({ message: 'Property removed successfully.', saved: false });
      } else {
        user.savedProperties.push(new mongoose.Types.ObjectId(propertyId));
        await user.save();
        return res.status(200).json({ message: 'Property saved successfully.', saved: true });
      }

    } catch (error: any) {
      console.error('Save/Unsave Property Error:', error.message);
      if (error.name === 'CastError') {
        return res.status(400).json({ message: 'Invalid Property ID format.' });
      }
      res.status(500).json({ message: 'Server error during saving/removing property.', error: error.message });
    }
  }
);

// Get saved properties
router.get(
  '/saved-properties',
  protect,
  async (req: Request, res: Response) => {
    try {
      const userId = req.user?._id;

      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized user. Please log in' });
      }

      const user = await User.findById(userId)
        .populate({
          path: 'savedProperties',
          populate: {
            path: 'landlord',
            select: 'username email fullName profilePicture'
          }
        })
        .select('savedProperties');

      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }

      res.status(200).json({
        message: 'Saved properties retrived successfully!',
        count: user.savedProperties.length,
        savedProperties: user.savedProperties,
      });

    } catch (error: any) {
      console.error('Get Saved Properties Error:', error.message);
      res.status(500).json({ message: 'Server error during fetching savd properties', error: error.message });
    }
  }
)



export default router;

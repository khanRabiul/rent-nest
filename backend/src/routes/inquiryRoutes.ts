import { Router, Request, Response, NextFunction } from 'express';
import { protect, authorizeRoles } from '../middleware/authMiddleware';
import Inquiry from '../models/Inquiry';
import User from '../models/Users';
import Property from '../models/Property';


const router = Router();

router.post('/',
  protect,
  async (req: Request, res: Response) => {
    try {
      const { recipient, property, messageText } = req.body;

      const senderId = req.user?._id;

      if (!senderId) {
        return res.status(401).json({ error: 'Sender ID not found. Authentication failed' })
      }

      if (!recipient || !property || !messageText) {
        return res.status(400).json({ message: 'Please provide recipient, property, and message text.' })
      }

      const recipientUser = await User.findById(recipient);
      if (!recipientUser || (recipientUser.role !== 'landlord' && recipientUser.role !== 'admin')) {
        return res.status(400).json({ message: 'Recipient is not valid landlord or admin' })
      }

      const existingProperty = await Property.findById(property);
      if (!existingProperty) {
        return res.status(404).json({ message: 'Related property not found.' })
      }

      const newInquiry = await Inquiry.create({
        sender: senderId,
        recipient,
        property,
        messageText,
      });
      res.status(201).json({
        message: 'Inquiry created successfully',
        inquiry: newInquiry,
      })

    } catch (error: any) {
      console.error('Send Inquiry Error:', error.message);
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map((val: any) => val.message);
        return res.status(400).json({ message: messages.join(', ') });
      }

      if (error.name === 'CastError') {
        return res.status(400).json({ message: 'Invalid ID format for recipient or property' });
      }
    }
  }
);


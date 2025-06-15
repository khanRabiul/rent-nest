import { Router } from 'express';
import { protect, authorizeRoles } from '../middleware/authMiddleware'; 

const router = Router();

router.post(
  '/properties',
  protect,
  authorizeRoles('landlord', 'admin'), 
  async (req, res) => {
    res.status(201).json({ message: 'Property added by landlord!' });
  }
);

router.get('/properties', async (req, res) => {
    res.status(200).json({ message: 'All properties listed.' });
});

export default router;
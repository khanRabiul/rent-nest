import { Router, Request, Response } from "express";
import { protect, authorizeRoles } from "../middleware/authMiddleware";
import Property from "../models/Property";
import User from "../models/Users";

const router = Router();
// Add a new property
router.post(
  '/',
  protect,
  authorizeRoles('landlord', 'admin'),
  async (req: Request, res: Response) => {
    try {
      const {
        title, description, price, currency, location,
        propertyType, bedrooms, bathrooms, livingRooms, areaSqFt,
        images, amenities, isPublished, status, advancePayment, hasWindows
      } = req.body;

      const landlordId = req.user?._id;

      if (!landlordId) {
        return res.status(401).json({ message: 'Landlord ID not found. Authentication failed.' });
      }

      const newProperty = await Property.create({
        landlord: landlordId,
        title, description, price, currency, location,
        propertyType, bedrooms, bathrooms, livingRooms, areaSqFt,
        images, amenities, isPublished, status, advancePayment, hasWindows
      });

      res.status(201).json({
        message: 'Property added successfully!',
        property: newProperty,
      });

    } catch (error: any) {
      console.error('Add Property Error:', error.message);
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map((val: any) => val.message);
        return res.status(400).json({ message: messages.join(', ') });
      }
      res.status(500).json({ message: 'Server error during adding property.', error: error.message });
    }
  }
);

// Get all properties
router.get('/', async (req: Request, res: Response) => {
  try {
    const properties = await Property.find({ isPublished: true })
      .populate('landlord', 'username email fullName profilePicture');

    res.status(200).json({
      message: 'Properties retrieved successfully!',
      count: properties.length,
      properties,
    });
  } catch (error: any) {
    console.error('Get All Properties Error:', error.message);
    res.status(500).json({ message: 'Server error during fetching properties.', error: error.message });
  }
});

// Get Types of Properties
router.get(
  '/types',
  async (req: Request, res: Response) => {
    try {
      const propertyTypes = (Property.schema.paths.propertyType as any).enumValues;

      if (!propertyTypes || propertyTypes.length === 0) {
        return res.status(404).json({ message: 'No property types found.' })
      }

      res.status(200).json({
        message: 'Property types retrieved successfully!',
        types: propertyTypes,
      })
    } catch (error: any) {
      console.error('Get Property Types Errror:', error.message);
      res.status(500).json({ message: 'SErver error during fetching property types.', error: error.message })
    }
  }
)

// Get a single property by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('landlord', 'username email fullName profilePicture');

    if (!property || !property.isPublished) {
      return res.status(404).json({ message: 'Property not found or not published.' });
    }

    res.status(200).json({
      message: 'Property retrieved successfully!',
      property,
    });
  } catch (error: any) {
    console.error('Get Single Property Error:', error.message);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid property ID format.' });
    }
    res.status(500).json({ message: 'Server error during fetching property.', error: error.message });
  }
});

// Update a property
router.put(
  '/:id',
  protect,
  authorizeRoles('landlord', 'admin'),
  async (req: Request, res: Response) => {
    try {
      const propertyId = req.params.id;
      const updates = req.body;

      let property = await Property.findById(propertyId);

      if (!property) {
        return res.status(404).json({ message: 'Property not found.' });
      }

      // Authorization check (now correctly placed after property is found)
      if (property.landlord.toString() !== req.user?._id?.toString() && req.user?.role !== 'admin') {
        return res.status(403).json({ message: 'You are not authorized to update this property.' });
      }

      property = await Property.findByIdAndUpdate(propertyId, updates, {
        new: true,
        runValidators: true
      });

      res.status(200).json({
        message: 'Property updated successfully!',
        property,
      });

    } catch (error: any) {
      console.error('Update Property Error:', error.message);
      if (error.name === 'CastError') {
        return res.status(400).json({ message: 'Invalid property ID format.' });
      }
      // ValidationError check (now correctly placed at the same level as CastError)
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map((val: any) => val.message);
        return res.status(400).json({ message: messages.join(', ') });
      }
      res.status(500).json({ message: 'Server error during updating property.', error: error.message });
    }
  }
);

// Delete a property
router.delete(
  '/:id',
  protect,
  authorizeRoles('landlord', 'admin'),
  async (req: Request, res: Response) => {
    try {
      const propertyId = req.params.id;
      const property = await Property.findById(propertyId);

      if (!property) {
        return res.status(404).json({ message: 'Property not found.' });
      }

      // Authorization check (now correctly placed after property is found)
      if (property.landlord.toString() !== req.user?._id?.toString() && req.user?.role !== 'admin') {
        return res.status(403).json({ message: 'You are not authorized to delete this property.' });
      }

      await Property.deleteOne({ _id: propertyId });

      res.status(200).json({
        message: 'Property deleted successfully!',
      });

    } catch (error: any) {
      console.error('Delete Property Error:', error.message);
      if (error.name === 'CastError') {
        return res.status(400).json({ message: 'Invalid property ID format.' });
      }
      res.status(500).json({ message: 'Server error during deleting property.', error: error.message });
    }
  }
);



export default router;
import { Router, Request, Response } from "express";
import multer from "multer";
import cloudinary from "../config/cloudinaryConfig";
import { protect } from "../middleware/authMiddleware";

const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).array('images', 3);

router.post(
  '/images',
  protect,
  upload,
  async (req: Request, res: Response) => {
    try {
      const files = req.files as Express.Multer.File[];

      if (!files || files.length === 0) {
        return res.status(400).json({ message: 'No image files uploaded.' });
      }

      const uploadedImageUrls: string[] = [];

      for (const file of files) {
        const result = await cloudinary.uploader.upload(
          `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
          {
            folder: 'rentnest',
            transformation: [{ width: 800, height: 600, crop: 'limit' }]
          }
        );
        uploadedImageUrls.push(result.secure_url);
      }

      res.status(200).json({
        message: 'Images uploaded successfully!',
        urls: uploadedImageUrls,
      });

    } catch (error: any) {
      console.error('Image Upload Error:', error.message);
      res.status(500).json({ message: 'Server error during image upload.', error: error.message });
    }
  }
);

export default router;
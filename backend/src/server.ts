import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import propertyRoutes from  './routes/propertyRoutes';
import inquiryRoutes from './routes/inquiryRoutes';
import uploadRoutes from './routes/uploadRoutes'
import * as jwtUtils from './utils/jwt';



const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI as string)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.log(err));


app.use('/api/auth', authRoutes);
app.use('/api/inquiries', inquiryRoutes);
// app.use('/api/properties', propertyRoutes);
app.use('/api/properties', propertyRoutes)
app.use('/api/upload', uploadRoutes);

const PORT = process.env.PORT || 5000;


app.get('/', (req, res) => {
  res.send('RenNest backend API is running');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoues from './routes/authRoutes';
import * as jwtUtils from './utils/jwt';


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI as string)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.log(err));

app.use('/api/auth', authRoues);

app.get('/', (req, res) => {
  res.send('RenNest backend API is running');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})
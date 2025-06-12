import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const  app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI as string)
.then(() => console.log('MongoDB connected successfully'))
.catch((err) => console.log(err));

app.get('/', (req, res) => {
  res.send('RenNest backend API is running');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})
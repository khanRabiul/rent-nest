import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: 'guest' | 'user' | 'landlord' | 'admin';
  fullName?: string;
  profilePicture?: string;
  savedProperties: mongoose.Types.ObjectId[];
  isBlocked: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema<IUser> = new Schema({
  username: {
    type: String,
    required: [true, 'User name is required'],
    unique: true,
    trim: true,
    minlength: [3, 'User name must be at least 3 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/.+@.+\..+/, 'Please enter a valid email address'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    // select: false,
  },
  role: {
    type: String,
    enum: ['guest', 'user', 'landlord', 'admin'],
    default: 'user',
    required: true,
  },
  fullName: {
    type: String,
    trim: true,
    default: null,
  },
  profilePicture: {
    type: String,
    default: null,
  },
  savedProperties: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    default: []
  }],
  isBlocked: {
    type: Boolean,
    default: false,
  }
},
  { timestamps: true }
);

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password!, salt);
  next();
});

UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema);

export default User;
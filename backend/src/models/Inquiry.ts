import mongoose, { Schema, Document, Model } from "mongoose";

export interface IInquiry extends Document {
  sender: mongoose.Types.ObjectId;
  recipient: mongoose.Types.ObjectId;
  messageText: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const InquirySchema: Schema = new Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Inquiry must have a sender'],
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Inquiry must have a recipient'],
  },
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: [true, 'Inquiry must have a property'],
  },
  messageText: {
    type: String,
    required: [true, 'Inquiry message is required'],
    trim: true,
    minlength: [5, 'Message must be at least 5 characters long'],
  },
  read: {
    type: Boolean,
    default: false
  },
}, 
{timestamps: true});

const Inquiry: Model<IInquiry> = mongoose.model<IInquiry>('Inquiry', InquirySchema);
export default Inquiry;
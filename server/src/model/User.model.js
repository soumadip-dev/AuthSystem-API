import mongoose from 'mongoose';

//* Schema definition
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationOtp: {
      type: String,
      default: '',
    },
    verificationOtpExpiry: {
      type: Number,
      default: 0,
    },
    resetPasswordOtp: {
      type: String,
      default: '',
    },
    resetPasswordOtpExpiry: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

//* Create the model
const User = mongoose.model('User', userSchema);

//* Export the model
export default User;

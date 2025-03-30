////////// IMPORTING
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

////////// DEFINING USER SCHEMA
const userSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

////////// PASSWORD HASHING BEFORE SAVING USER
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

////////// CREATING USER MODEL
const User = mongoose.model('User', userSchema);

////////// EXPORTING
export default User;

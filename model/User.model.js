import bcrypt from 'bcryptjs'; // Importing the Bcrypt library for password hashing
import mongoose from 'mongoose'; // Importing the Mongoose library
// Creating a new schema for the User model
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
    timestamps: true, // Adding timestamps to the schema this will add createdAt and UpdatedAt
  }
);

// Hook to hash password before saving user to database
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const User = mongoose.model('User', userSchema); // Defining a Mongoose model named 'User' using the schema

export default User; // Exporting the User model to be used in other parts of the project

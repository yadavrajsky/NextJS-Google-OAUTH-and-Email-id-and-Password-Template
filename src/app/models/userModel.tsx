import mongoose, { model, models, Schema } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

const userSchema = new Schema({
  _id: {
    type: String,
    default: () => uuidv4(),
    immutable: true,
  },
  email: {
    type: String,
    required: [true, "Please Enter Your Email"],
    unique: true,
    validate: [validator.isEmail, "Please Enter a valid Email"],
  },
  password: {
    type: String,
    required: [true, "Please Enter Your Password"],
    minLength: [8, "Password should be greater than 8 characters"],
    select: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  firstName: {
    type: String,
    required: [true, "Please Enter Your First Name"],
  },
  lastName: {
    type: String,
    required: [true, "Please Enter Your Last Name"],
  },
  profilePath: {
    type: String,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
}, { timestamps: true });

// Transformation for JSON output
userSchema.set('toJSON', {
  transform: (doc, ret, options) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.createdAt;
    delete ret.updatedAt;
    delete ret.__v;
    return ret;
  }
});

// Transformation for object output
userSchema.set('toObject', {
  transform: (doc, ret, options) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.createdAt;
    delete ret.updatedAt;
    delete ret.__v;
    return ret;
  }
});


// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// JWT Token
userSchema.methods.getJWTToken = function() {
  return jwt.sign({ id: this._id }, process.env.NEXTAUTH_SECRET ?? 'defaultSecret', {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Compare Password
userSchema.methods.comparePassword = async function(password: string) {
  return await bcrypt.compare(password, this.password);
};

// Generate Reset Password Token
userSchema.methods.getResetPasswordToken = function() {
  // Generate Token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash and set resetPasswordToken
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes

  return resetToken;
};

// Create or get existing model
const UserModel = models.User || model('User', userSchema);

export default UserModel;

import mongoose, { Document, Schema, Model } from "mongoose";
import bcrypt from "bcryptjs";
import { Role } from "../types";

// Interface.
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: Role;
  phone?: string;
  avatar?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  // Methods
  comparePassword(candidatePassword: string): Promise<boolean>;
}


// Schema.
const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false, // never returned by default
    },
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.JOB_SEEKER,
    },
    phone: {
      type: String,
      trim: true,
      match: [/^\+?[\d\s\-()]{7,15}$/, "Please enter a valid phone number"],
    },
    avatar: {
      type: String,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret: Record<string, unknown>) => {
        delete ret["password"];
        delete ret["__v"];
        return ret;
      },
    },
  }
);



// ─── Pre-save Hook: Hash Password ─────────────────────────────────────────────
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ─── Methods ──────────────────────────────────────────────────────────────────
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);
export default User;
import mongoose from "mongoose";
import bcrypt from "bcrypt";
const userSchema = new mongoose.Schema(
  {
    username: {
        type: String,
        required: true,
        unique: true,
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
    role: {
      type: String,
      enum: ["user", "admin","employee", "manager"],
      default: "user",
    },
  },
  { timestamps: true }
);

userSchema.methods.checkPassword = async function(password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (err) {
    console.error('Password comparison error:', err);
    throw err; }
};

userSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
};

const User = mongoose.model("User", userSchema);
export default User; 

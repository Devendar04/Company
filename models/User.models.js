import mongoose from "mongoose";
import bcrpt from "bcrypt";
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

export const checkPassword = async function (password) {
  
  return await bcrpt.compare(password, this.password);
}
const User = mongoose.model("User", userSchema);
export default User; 

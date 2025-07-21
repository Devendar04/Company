import User from "../models/User.models.js";
import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET;

const TokenGenerate = (user) => {
  const payload = {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
  };
  return jwt.sign(payload, secret, { expiresIn: "24h" });
};

export  const getAllusers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({ users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}
export const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId).select('+password');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "Please provide both old and new passwords" });
    }
    const isMatch = await user.checkPassword(oldPassword);

    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}
export const register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    console.log(req.body);

    if (!username || !email || !password || !role) {
      res.status(400).json({ message: "Filled all input Fields !!" });
    }

    const userExists = await User.findOne({ email });
    const hashedPassword = await User.hashPassword(password);
    if (userExists) {
      return res.status(400).json({ message: "User is Already is Exits" });
    } else {
      const newUser = await User.create({ username, email, password: hashedPassword, role });
      return res.status(201).json({
        token: TokenGenerate(newUser),
        user: { id: newUser.id, email: newUser.email, role: newUser.role },
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req,res) =>{
    try {
    const {email ,password} = req.body;
    const userExists = await User.findOne({email}).select("+password")
    if(!email || !password){
        res.status(400).json({message : "Fill the input field"})
    }
    if (!userExists) {
      return res.status(400).json({ message: "User is not found" });
    }
    const Password = await userExists.checkPassword(password)
    if (!Password) {
      res.status(400).json({ message: "Invalid password" });
    }
    const token = TokenGenerate(userExists)
    
    return res.status(200).json({
      token: token,
      user: {
        id: userExists.id,
        username: userExists.username,
        email: userExists.email,
        role: userExists.role,
        name: userExists.name,
      },
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({ message: "Internal server error" });
  }
}


export default {login,register}
import User from "../models/User.models.js";
import jwt from "jsonwebtoken"


export const protect=async(req,res,next)=>{
    const token=req.headers.authorization.split(" ")[1];

    if(!token){
        res.status(401).json({message:"Token not found : failed authentication !!"})
    }
    const decoded=jwt.verify(token,process.env.JWT_SECRET);
    const user=await User.findById(decoded.id).select("-password");
    req.user=user;
    next()
}
export const authorization=(...roles)=>(req,res,next)=>{
    console.log(roles)
    if(!roles.includes(req.user.role)){
        res.status(403).json({message:"authorization failed : not have permission to access"})
    }else{
        next();
    }
}


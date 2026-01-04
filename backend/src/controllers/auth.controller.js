import User from "../models/user.model.js";
import bcrypt from "bcryptjs"
import {generateToken} from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";


export const signup = async (req, res) => {
    const {email,fullName,password} = req.body;
    try
    {
        if(!fullName || !email || !password)
        {
            return res.status(400).json({message:"All fields are required"});
        }
        if(password.length < 6)
        {
            return res.status(400).json({message: "Password must be at least 6 characters"});
        }

        const user = await User.findOne({email:email});
        if(user)
        {
            return res.status(400).json({message: "User already exists"});
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        const newUser = new User({
            fullName,
            email,
            password : hashedPassword
        })

        if(newUser)
        {
            //send json web token
            generateToken(newUser._id,res);
            await newUser.save();


            res.status(200).json({
                _id:newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic : newUser.profilePic
            })
        }
        else
        {
            res.status(400).json({message: "Invalid credentials"});
        }
    }catch (error)
    {
        console.log("Error in signup controller",error.messsage);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export const login = async (req, res) => {
    try{
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if (!user) {
            return res.status(400).json({message: "Invalid Credentials"});
        }
        const isCorrect = await bcrypt.compare(password, user.password);
        if (!isCorrect) {
            return res.status(400).json({message: "Invalid Credentials"});
        }

        await generateToken(user._id, res);

        res.status(200).json({
            _id: user._id,
            email: user.email,
            fullName: user.fullName,
            profilePic: user.profilePic
        })
    }
    catch(error)
    {
        console.log("Error in login controller: ",error.message);
        return res.status(400).json({message : "Internal server error"});
    }
}

export const logout = (req, res) => {
    try{
        res.cookie("jwt","",{maxAge:0});
        return res.json({message : "Logged Out Successfully"});
    }
    catch(error)
    {
        console.log("Error in the logout controller: ",error.message);
        res.status(400).json({message:"Internal Server Error"});
    }
}

export const updateProfile = async (req,res) => {
    try
    {
        const {profilePic} = req.body;
        const userId = req.user._id;
        if(!profilePic)
        {
            return res.status(400).json({message : " Profile Pic is not Present "});
        }


        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updatedUser = await User.findByIdAndUpdate(userId,{profilePic: uploadResponse.secure_url},{new:true});

        return res.status(200).json(updatedUser);
    }catch (error)
    {
        console.log("Error in the updateProfile Controller: ",error.message);
        return res.status(400).json({message:"Internal Server Error"});
    }
}

export const checkAuth = (req,res) => {
    try
    {
        return res.status(200).json(req.user);
    }
    catch(error)
    {
        console.log("Error in the check auth controller: ",error.message);
        return res.status(500).json({message:"Internal Server Error"});
    }
}
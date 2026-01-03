import User from "../models/user.model.js";
import bcrypt from "bcryptjs"

export const signup = async (req, res) => {
    const {email,fullName,password} = req.body;
    try
    {
        if(password.length < 6)
        {
            res.status(400).json({message: "Password must be at least 6 characters"});
        }

        const user = await User.findOne({email});
        if(user)
        {
            res.status(400).json({message: "User already exists"});
        }
        const salt = bcrypt.genSalt(10);
        const hashedPassword = bcrypt.hash(password,salt);

        const newUser = new User({
            fullName,
            email,
            password : hashedPassword
        })

        if(newUser)
        {
            //send json web token

        }
        else
        {
            res.status(400).json({message: "Invalid credentials"});
        }
    }catch (error)
    {

    }
}

export const login = (req, res) => {
    res.send("Login route");
}

export const logout = (req, res) => {
    res.send("Logout route");
}
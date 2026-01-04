import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";

export const getUsersForSideBar = async (req, res) => {
    try {
        const loggedInUser = req.user._id;
        const filteredUsers = await User.find({_id: {$ne: loggedInUser}}).select("-password");
        return res.status(200).json(filteredUsers);
    } catch (error) {
        console.log("Error in the message controller: ",error.message);
        return res.status(500).json({message : "Interal Server Error"});
    }
}

export const getMessages = async  (req,res) => {
    try {
        const {id:userToChatId} = req.params;
        const myId = req.user._id;
        const messages = await Message.find({
            $or : [
                {senderId:myId,receiverId:userToChatId},
                {senderId:userToChatId,receiverId:myId}
            ]
        })

        return res.status(200).json(messages);

    }catch (error)
    {
        console.log("Error in the getMessages controller: ",error.message);
        return res.status(500).json({message:"Internal Server Error"});
    }
}

export const sendMessage = async (req,res) => {
    try {
        const {text,image} = req.body;
        const {id:receiverId} = req.params;
        const senderId = req.user._id;

        let imageURL;
        if(image)
        {
            const response = await cloudinary.uploader.upload(image);
            imageURL = response.secure_url;
        }
        const newMessage = new Message({
            senderId:senderId,
            receiverId:receiverId,
            text:text,
            image:imageURL
        })

        await newMessage.save();

        //socket.io functionality

        return res.status(201).json(newMessage);
    }catch(error)
    {
        console.log("Error in the sendMessage Controller: ",error.message());
        return res.status(500).json({message : " Internal Server Error"});
    }
}
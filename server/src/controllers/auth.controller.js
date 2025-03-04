import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

import cloudinary from "../config/cloudinary.js";

const cookieOption = {
    expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    httpOnly: true
}
export const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const existinguser = await User.findOne({ email });
        if (existinguser) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            })
        }

        const user = await User.create({
            name,
            email,
            password
        })

        let token = user.getJWTtoken();
        user.password = undefined;
        res.cookie("token", token, cookieOption)


        res.status(201).json({
            success: true,
            message: "user created succesfully",
            token,
            user
        }) 

    } catch (error) {
        console.log("Error in signup controller", error.message);
    
    }


}
export const Login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "please enter all details"
            })
        }

        const existingUser = await User.findOne({ email }).select("+password");
        if (!existingUser) {
            return res.status(400).json({
                success: false,
                message: "user does not exists"
            })

        }
        const comparePass = await existingUser.comparePassword(password)
        if (!comparePass) {
            return res.status(400).json({
                success: false,
                message: "entered pass is wrong"
            })
        }

        let token = existingUser.getJWTtoken();
        existingUser.password = undefined

        res.cookie("token", token, cookieOption)

        res.status(200).json({
            success: true,
            message: "logged in sucessfully",
            token,
            existingUser
        })
    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }



}

export const logout = (req, res) => {
    try {
        res.cookie("token", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
export const profile = async (req, res) => {
    const user = req.user
    if (!user) {
        return res.status(400).json({
            success: false,
            message: "no user found"
        })
    }
    res.status(200).json({
        success: true,
        message: "User details fetched successfully",
        user
    });

};


export const updateprofile = async (req, res) => {
    try {
        console.log("Updating profile for user:", req.user)
        const { profilePic } = req.body;
        const userId = req.user._id;

        if (!profilePic) {
            return res.status(400).json({ message: "Profile pic is required" });
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilePic: uploadResponse.secure_url },
            { new: true }
        );

        res.status(200).json(updatedUser);
    } catch (error) {
        console.log("error in update profile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const checkAuth = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            profilePic: user.profilePic,
            createdAt: user.createdAt,
            dmOff: user.dmOff,  
            pinnedChats: user.pinnedChats,  
            blockedUsers: user.blockedUsers, 
            messageRequests: user.messageRequests 
        });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

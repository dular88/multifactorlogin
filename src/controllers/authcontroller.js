import User from "../models/user.js";
import bcrypt from "bcryptjs";
import speakeasy from "speakeasy";
import qrCode from "qrcode";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            password: hashedPassword,
            isMfaActive: false
        });

        console.log("New User:", newUser);
        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Error registering user:", error);  // Logs the actual error details
        res.status(500).json({ error: "Error registering user", message: error.message });
    }
};
;
export const login = async (req,res)=>{
    console.log("Authenticated user is ",req.user);
    res.status(200).json({
        message:"USer logged in successfully",
        username:req.user.username,
        isMfaActive:req.user.isMfaActive
    });
};
export const logout = async (req, res)=>{
    if(!req.user) res.status(401).json({message:"Unauthorised user"});
    req.logout((err)=>{
       if(err){
        return next(err);
       }

       req.session.destroy((err)=>{
            if(err){
                return next(err);
            }

                res.clearCookie("connect.sid");
                res.status(200).json({ message: "Logged out successfully" });
          
       });
    });
};
export const authStatus = async (req,res)=>{
    if(req.user){
        res.status(200).json({
            message:"USer logged in successfully",
            username:req.user.username,
            isMfaActive:req.user.isMfaActive
        });
    }else{
        res.status(401).json({message:"Unauthorised user"});
    }
};
export const setup2FA = async (req, res)=>{
   try {
    console.log("The request req.user is", req.user);
    const user = req.user;
    var secret = speakeasy.generateSecret();
    console.log("Secret object is ",secret);
    user.twoFactorSecret = secret.base32;
    user.isMfaActive = true;
    await user.save();
    const url =speakeasy.otpauthURL({
        secret:secret.base32,
        label:`${req.user.username}`,
        issuer: "https://dinesh.com",
        encoding: "base32"
    });

    const qrImageUrl = await qrCode.toDataURL(url);
    res.status(200).json({
        secret:secret.base32,
        qrCode:qrImageUrl
    });
   } catch (error) {
    res.status(500).json({error:"Error setting up 2FA",error:error});
   }
};

export const verify2FA = async (req, res)=>{
    const {token} = req.body;
    const user = req.user;
    const verified = speakeasy.totp.verify({
        secret:user.twoFactorSecret,
        encoding:"base32",
        token
    });

    if(token){
        const jwtToken = jwt.sign({
            username:user.username,
        }, process.env.JWT_SECRET,
           {expiresIn:"1hr"}
    );
    res.status(200).json({message:"2FA Successfull", token : jwtToken});
    }else{
        res.status(400).json({
            message:"Invalid 2FA token"
        });
    }
};
export const reset2FA = async (req, res)=>{
    try {
        const user = req.user;
        user.twoFactorSecret = "";
        user.isMfaActive = false;
        await user.save();
        res.status(200).json({
            message:"2FA reset successfully"
        });
    } catch (error) {
        res.status(500).json({error:"Error resetting 2FA",message:error});
}
};

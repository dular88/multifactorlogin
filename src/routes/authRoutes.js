import { Router } from "express";
import passport from "passport";
import { register,login, authStatus, logout, verify2FA, reset2FA, setup2FA } from "../controllers/authcontroller.js";

const router = Router();

router.post("/register",  register);
router.post("/login", passport.authenticate("local"),  login);
router.get("/status",  authStatus);
router.post("/logout",  logout);

router.post("/2fa/setup", (req, res, next)=>{
    if(req.isAuthenticated()) return next();
    res.status(401).json({message:"Unauthorised"});
}, setup2FA);

router.post("/2fa/verify", (req, res, next)=>{
    if(req.isAuthenticated()) return next();
    res.status(401).json({message:"Unauthorised"});
},  verify2FA);
router.post("/2fa/reset", (req, res, next)=>{
    if(req.isAuthenticated()) return next();
    res.status(401).json({message:"Unauthorised"});
},  reset2FA);

export default router;
import express, { urlencoded } from "express";
import session from "express-session";
import passport from "passport";
import dotenv from "dotenv";
import cors from "cors";
import dbConnect from "./config/dbConnect.js";
import authRoutes from "./routes/authRoutes.js";
import "./config/passportConfig.js";


dotenv.config();
dbConnect();

const app = express();


// middleware
const corsOptions = {
origin: ["http://localhost:3001"],
credentials : true,
}

app.use(cors(corsOptions));
app.use(express.json({limit:"100mb"}));
app.use(urlencoded({limit:"100mb",extended:true})); 
app.use(session({
    secret: process.env.secret || "secret",
    resave : false,
    saveUninitialized : false,
    cookie:{
        maxAge:60000*60,
    }
}));

app.use(passport.initialize());
app.use(passport.session());

const PORT = process.env.PORT || 7002;

app.use("/api/auth", authRoutes);

app.listen(PORT, ()=>{
 console.log(`Server is running on ${PORT}`);
});
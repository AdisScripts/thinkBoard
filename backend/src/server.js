import express from "express";
import authRoutes from "./router/authRoutes.js";
import notesRoutes from "./router/notesRoutes.js";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
import rateLimiter from "./middleware/rateLimiter.js";
import cors from "cors";
import path from "path"

dotenv.config();

const app= express();
const PORT=process.env.PORT || 5001;
const __dirname=path.resolve()


//middleware
if(process.env.NODE_ENV!=="production"){
app.use(
    cors({
    origin: "http://localhost:5173",
})
);
}
app.use(express.json());//this middleware is used to parse JSON bodies: req.body
app.use(rateLimiter);// Apply rate limiting middleware
 // Enable CORS for all routes

//simple custom middleware to log request method and URL
// app.use((req,res,next) => {
//     console.log(`Request Method: ${req.method}, Request URL: ${req.url}`);
//     next();
// });
app.use("/api/auth", authRoutes);

app.use("/api/notes",notesRoutes);

app.use(express.static(path.join(__dirname,"../frontend/dist")))

if(process.env.NODE_ENV ==="production"){
    app.get("*",(req,res)=>{
    res.sendFile(path.join(__dirname,"../frontend","dist","index.html"))
})
}

connectDB().then(() => {
app.listen(PORT, () => {
    console.log("Server is running on port:", PORT);
});
});

// mongodb+srv://hellogaga036:VeAdBoppyJjNuyy8@cluster0.7uvpyar.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
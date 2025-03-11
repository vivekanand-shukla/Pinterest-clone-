import express from 'express'; 
const app = express();            
import dotenv from 'dotenv';         
dotenv.config() ;                
import connectDb from './database/db.js';        
import cookieParser from 'cookie-parser';
import cloudinary from 'cloudinary';
import path  from 'path';


const port = process.env.PORT || 5000;


cloudinary.v2.config({
    cloud_name:  process.env.Cloud_Name,
    api_key :    process.env.Cloud_Api,
    api_secret:  process.env.Cloud_Secret
    

});


// using middware
app.use(express.json());
app.use(cookieParser());





// importing routes 
import userRoutes from './routes/userRoutes.js';
import pinRoutes from './routes/pinRoutes.js';
//using  routes

app.use("/api/user", userRoutes)
app.use("/api/pin", pinRoutes)


const __dirname = path.resolve()
app.use(express.static(path.join(__dirname,"/frontend/dist")))
app.get("*",(req,res)=>{
    res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
})



app.listen(port, () => {
    console.log(`server is running on http://localhost:${port}`);
    connectDb()
});



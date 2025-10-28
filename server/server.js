const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const uploadRoutes = require("./routes/uploadRoutes");
const path = require("path");
const menuRoutes=require("./routes/menuRoutes")
const orderRoutes=require("./routes/orderRoutes");
const tableRoutes = require("./routes/tableRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const Chef=require("./models/Chef");


dotenv.config();

const initializeChefs=async()=>{
    try{
        const count=await Chef.countDocuments();
        if(count===0){
            await Chef.insertMany([
                 { name: "Karan" },
                { name: "Alex" },
                { name: "Diya" },
                { name: "Rachit" },
            ])
            console.log("Default chefs added");
        }else{
            console.log("Chefs already exist, skipping initialization");
        }
    }catch(err){
        console.error("Error initializing chefs:", err);
    }
}

mongoose.connect(process.env.MONGO_URI)
.then(async()=>{
    console.log("MongoDB Connected");
    await initializeChefs();
})
.catch((err) => console.log("Error:", err.message));

const app = express();

app.use(express.json());
app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://restaurant-management-ochre-mu.vercel.app/",
    "https://restaurant-management-67vp.vercel.app/"
  ],
  credentials: true,
}

));

// Static folder to serve uploaded images
app.use("/uploads", express.static(path.resolve(__dirname, "/uploads")));

// Upload route
app.use("/api/upload", uploadRoutes);

//menu routes
app.use("/api/menu", menuRoutes);

//order routes
app.use("/api/orders", orderRoutes);

//Table routes
app.use("/api/tables", tableRoutes);

//Anaytics
app.use("/api/analytics", analyticsRoutes);



app.get("/", (req, res) => {
  res.send("Restaurant Management API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
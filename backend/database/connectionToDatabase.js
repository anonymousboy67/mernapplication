import mongoose from "mongoose";

export const connectToDatabase=async()=>{
    try{
        const connection=await mongoose.connect(process.env.MONGODB_URI);
        console.log(`Connected to MongoDB:${connection.connection.host}`);
    }catch(error){
        console.log("Error connecting to MongoDB");
    }
}
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

// connect MONGO_DB database

 const DBconnection = async () => {
    const MONGODB_URL = process.env.MONGODB_URI;
 try{
     await mongoose.connect(MONGODB_URL, {useNewUrlParser : true});
     console.log("DB connection established!");

 }catch(err){
    console.log(" Error connecting to MONGODB " + err);
 }
}

export default DBconnection;


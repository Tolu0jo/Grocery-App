import mongoose from "mongoose";
import { DB_URL } from "../config";

export const dbConnection = async()=>{
    try {
        mongoose.connect(DB_URL);
        console.log("DB connected ...")
    } catch (error) {
        console.log(error)
        process.exit(1);
    }
}
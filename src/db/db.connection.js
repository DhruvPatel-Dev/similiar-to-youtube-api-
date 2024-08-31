import mongoose from "mongoose";
import  {DB_NAME}  from "../constant.js";


export const dbConnection = async ()=>{

    try {
        await mongoose.connect(`${process.env.MONGO_URL}${DB_NAME}`)
        console.log("dbConnected")
    } catch (error) {
        console.log(`dbNotConnected`)
        process.exit(1)
    }

}





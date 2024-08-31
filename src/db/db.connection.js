import mongoose from "mongoose";
import  {DB_NAME}  from "../constant.js";


export const dbConnection = async ()=>{

    try {
        await mongoose.connect(`${process.env.MONGO_URL}${DB_NAME}`).then(()=>{
            console.log('dbconnected')
        }).catch((Error)=>{
            console.log(Error)
        })
    } catch (error) {
        console.log(`dbNotConnected`)
        process.exit(1)
    }

}





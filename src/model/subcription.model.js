import mongoose,{Schema} from "mongoose";


const subscriptionSchema = new Schema({
    subscriber:{
        type:[
            
        ]
    }
})






export const subscription = mongoose.model("subscription",subscriptionSchema);
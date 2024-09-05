import mongoose,{Schema} from "mongoose";

const likeSchema = new Schema({
    likedBy:{
        type:Schema.Types.ObjectId,
        ref:"user"
    },
    video:{
        type:Schema.Types.ObjectId,
        ref:"video"
    },
    comment: {
        type:Schema.Types.ObjectId,
        ref:"comment"

    }
},{
    timestamps:true
})



export const likeModel = mongoose.model("like",likeSchema)
import mongoose,{Schema} from "mongoose";

const likeSchema = new Schema({
    likedBy:{
        type:Schema.Types.ObjectId,
        ref:"users"
    },
    video:{
        type:Schema.Types.ObjectId,
        ref:"videos"
    },
    comment: {
        type:Schema.Types.ObjectId,
        ref:"comments"

    }
},{
    timestamps:true
})



export const likeModels = mongoose.model("likes",likeSchema)
import mongoose, { Mongoose,Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
mongooseAggregatePaginate

const videoSchema = new Schema({
    videofile:{
        type:String,
        required:true,
    },
    thumbnail:{
        type:String,
        required:true,
    },
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true
    },
    Duration:{
        type:Number,
        required:true,
    },
    views:{
        type:Number,
        default:0
    },
    isPublished:{
        type:Boolean,
        required:true,
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:"users"
    }

},
{
    timestamps:true,
})

export const videos = mongoose.model("videos",videoSchema)

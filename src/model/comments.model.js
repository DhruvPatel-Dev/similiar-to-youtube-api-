import mongoose,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";


const commentSchema = new Schema({
    content:{
        type:String,
        required:true
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:"users"
    },
    video:{
        type:Schema.Types.ObjectId,
        ref:"videos"
    },

},
{
    timestamps:true
})


export const commentModels = mongoose.model("comments",commentSchema)

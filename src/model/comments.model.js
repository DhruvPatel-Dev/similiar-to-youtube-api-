import mongoose,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";


const commentSchema = new Schema({
    content:{
        type:String,
        required:true
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:"user"
    },
    video:{
        type:Schema.Types.ObjectId,
        ref:"video"
    },

},
{
    timestamps:true
})


export const commentModel = mongoose.model("comment",commentSchema)

import mongoose,{Schema} from "mongoose";


const playlistSchema = new Schema({

    name:{
        type:String,
        required:true,
        unique:true,
    },
    description:{
        type:String,

    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:"user"
    },
    videos:[{
        type:Schema.Types.ObjectId,
        ref:"video"
    }]

},
{
    timestamps:true
})


export const playlist = mongoose.model("playlist",playlistSchema)
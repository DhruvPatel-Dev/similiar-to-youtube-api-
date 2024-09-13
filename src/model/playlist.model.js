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
        ref:"users"
    },
    videos:[{
        type:Schema.Types.ObjectId,
        ref:"videos"
    }]

},
{
    timestamps:true
})


export const playlists = mongoose.model("playlists",playlistSchema)
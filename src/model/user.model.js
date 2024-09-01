import mongoose,{Schema} from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const userSchema = new Schema({

    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true
        
    },
    fullname:{
        type:String,
        required:true,
        trim:true,
        lowercase:true,

    },
    avatar:{
        type:String,
        required:true,
    },
    coverimage:{
        type:String,
        required:true,
    },
    watchhistory:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"video"
        }
    ],
    password:{
        type:String,
        required:[true,"password is required"]
    },
    refreshtoken:{
        type:String,
    }

     
},
{
    timestamps:true
})



userSchema.pre("save",async function (next){
    if(!this.isModified("password")) return next();

    try {
        this.password= await bcrypt.hash(this.password,10);
      next()
    } catch (error) {
        next(error)
    }
     
})
userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password)
}
userSchema.methods.genrateAccessToken = function (){
    return jwt.sign(
        {
            _id:this._id,
        
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }

    )
}
userSchema.methods.genrateRefreshToken = function (){
   return jwt.sign(
        {
            _id:this._id,
            email:this.email
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }

    )
}

export const user = mongoose.model("user",userSchema)
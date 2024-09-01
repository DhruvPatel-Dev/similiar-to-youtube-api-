import { user } from "../model/user.model.js"
import ApiError from "../utils/apiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import JWT from "jsonwebtoken"


export const verifyJWT  = asyncHandler(async (req,res,next)=>{

  const token =  req.cookies?.accesstoken || req.header("Authorization")?.replace("Bearer ","")

  if(!token)
  {
    throw new ApiError(400,"unauthorized")
  }

 const decode = JWT.verify(token,process.env.ACCESS_TOKEN_SECRET);
          
try {
         
  const cuser = await user.findById(decode._id).select("-password -refreshtoken")
   req.user = cuser;
   next()
} catch (error) {
 
  throw new ApiError(500,"token is not valid")
    
}


})
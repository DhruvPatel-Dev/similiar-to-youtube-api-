import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js"
import {user} from "../model/user.model.js"
import { uploadOnCloudnary } from "../utils/cloudnary.js";
import ApiResponse from "../utils/ApiResponse.js";
import JWT from "jsonwebtoken"

const genrateAccessAndRefreshToken = async (userId) =>{

    const cuser = await user.findById(userId);
    const accessToken = await cuser.genrateAccessToken();
    const refreshToken = await cuser.genrateRefreshToken();

    cuser.refreshtoken = refreshToken;
    await cuser.save({validateBeforeSave:false});
    return {accessToken,refreshToken }
}

const registerUser = asyncHandler( async (req,res)=>{
    
    const {username,email,fullname,password} = req.body;
      
    if(!username||!fullname||!email||!password)
        {
            throw new ApiError(400,"All field are mandatory")
        }    

      const existeduser = await user.findOne({

            $or:[{username},{email}]
        })

        if(existeduser)
        {
            throw new ApiError(409,"emailor username is ALREADY in use");
        }
           
        const avatarLocalpath = req.files?.avatar[0]?.path  
        const coverimageLocalpath = req.files?.coverimage[0]?.path  
       
        if(!avatarLocalpath||!coverimageLocalpath)
            {
                throw new ApiError(400,"avatar and coverimage required");
            } 
            
        const avtarUpload = await uploadOnCloudnary(avatarLocalpath)
        const coverImageUpload = await uploadOnCloudnary(coverimageLocalpath);
      
       let cuser
       try {
        
       cuser =  await user.create({
        username,
        email,
        password,
        fullname,
        avatar:avtarUpload.url,
        coverimage:coverImageUpload.url
       });
       } catch (error) {
         throw new ApiError(500,"error while creating user")
       }

        const createduser = await user.findById(cuser._id).select("-password -refreshtoken");

        if(!createduser)
        {
            throw new ApiError(500,"something went wrong while createing user");

        }
           
       return res.status(201).json( new ApiResponse(201,createduser,"user registerd successfuly"));
       

})

const loginUser = asyncHandler(async(req,res)=>{
     
   
  const {email,password} = req.body
  
    if(!email||!password) throw new ApiError(400,"email and password are required");
   
    const cuser = await user.findOne({email});
   
    if(!cuser) throw new ApiError(400,"user not exist")
      
    const result = await cuser.isPasswordCorrect(password)

       if(!result) throw new ApiError(400,"invalid password")
        
      const {accessToken,refreshToken} = await genrateAccessAndRefreshToken(cuser._id);
      cuser.password = undefined;
      cuser.refreshtoken = undefined;

      const options = {
        httpOnly:true,
        secure:true,
      }

      return res
      .status(200)
      .cookie("accesstoken",accessToken,options)
      .cookie("refreshtoken",refreshToken,options)
      .json(
        new ApiResponse(200,{
            user:cuser,accessToken,refreshToken
        },
        "user loggeed in success")
      )



     


 
})

const logOutUser = asyncHandler(async(req,res)=>{
  await user.findByIdAndUpdate(req.user._id,{
  $unset:{
    refreshtoken:1
  }
  },
  {
    new:true
  })
 
  const options = {
    httpOnly:true,
    secure:true
  }

  return res.
  clearCookie('accesstoken',options).
  clearCookie('refreshtoken',options).
  json( new ApiResponse(200,"user log out SuccessFully"))




})

const refreshAccessToken = asyncHandler (async(req,res)=>{

  const incomingRefreshToken = req.cookies.refreshtoken || req.body.refreshtoken;
   if(!incomingRefreshToken) throw new ApiError(400,"please provide token")

    try {
      
      const decode = JWT.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
      const cuser = await user.findById(decode._id)
      if(incomingRefreshToken!==cuser.refreshtoken)
      {
        throw new ApiError(401,"invalid token")
      }
     const options = {
      httpOnly:true,
      secure:true
    }  
    const {accessToken,refreshToken} = await genrateAccessAndRefreshToken(cuser._id);
    res.status(200).
    cookie("accesstoken",accessToken,options).
    cookie("refreshtoken",refreshToken,options).
    json(new ApiResponse(200,{
      accessToken,
      refreshToken
    },
    "token genrated"))


    } catch (error) {
             
      throw new ApiError(error.statusCode,error.message);
    }
})

const changePassword = asyncHandler(async(req,res)=>{
      
   const {currentPassword,newPassword} = req.body;
    
   if(!currentPassword||!newPassword)  throw new ApiError(401,"all field are mandotory")

   const cuser = await user.findById(req.user._id)
   const result = await cuser.isPasswordCorrect(currentPassword);
   if(!result) throw new ApiError(400,"current password is wrong")
    cuser.password = newPassword;
    await cuser.save({validateBeforeSave:false})

    res.status(200).json(new ApiResponse(201,"password changed success"));




})

const updateUserDetails = asyncHandler (async (req,res)=>{
  const {fullname,email} = req.body;
  if(!fullname||!email) throw new ApiError(400,"all filed required");
 
  try {
      
  await user.findByIdAndUpdate(req.user._id,{fullname,email},{new:true})
 
 res.status(201).json(new ApiResponse(201,"updated successfully"))
    
  } catch (error) {

    throw new ApiError(500,"server error")
  }
   
})

const updateUserAvater = asyncHandler(async(req,res)=>{
  
  const avatarLocalPath = req.file?.path;

  if(!avatarLocalPath) throw new ApiError(400,"please upload avatar");
  
    try {

      
    const avatarUpload =  await uploadOnCloudnary(avatarLocalPath)
    await user.findByIdAndUpdate(req.user._id,{$set:{
         avatar:avatarUpload.url
       }},{
        new:true
      })

 res.status(200).json(new ApiResponse(201,"avtar updated succesfully"));

      
    } catch (error) {
      throw new ApiError(500,"Failed to Update avtar")
    }
})

const updateCoverImage = asyncHandler ( async (req,res) =>{

  const coverImageLocalPath = req.file?.path;

  if(!coverImageLocalPath) throw new ApiError(400,"please upload cover image");
  
    try {

      
    const coverUpload =  await uploadOnCloudnary(coverImageLocalPath)
    await user.findByIdAndUpdate(req.user._id,{$set:{
        coverimage:coverUpload.url
       }},{
        new:true
      })

 res.status(200).json(new ApiResponse(201,"cover image updated succesfully"));

      
    } catch (error) {
      throw new ApiError(500,"Failed to Update cover image")
    }
})











export {registerUser,loginUser,logOutUser,refreshAccessToken,changePassword,updateUserDetails,updateUserAvater,updateCoverImage}
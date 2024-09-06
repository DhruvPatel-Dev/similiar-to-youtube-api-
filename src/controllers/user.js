import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js"
import {user} from "../model/user.model.js"
import { deleteOnCloudnary, delteimageOnCloudnary, uploadOnCloudnary } from "../utils/cloudnary.js";
import ApiResponse from "../utils/ApiResponse.js";
import JWT from "jsonwebtoken"


const genrateAccessAndRefreshToken = asyncHandler( async (userId) =>{

  const cuser = await user.findById(userId);
  const accessToken =  cuser.genrateAccessToken();
  const refreshToken = cuser.genrateRefreshToken();
  cuser.refreshtoken = refreshToken;
  await cuser.save({validateBeforeSave:false});
  return {accessToken,refreshToken}
})

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
        
           
       try {
        
      const cuser =  await user.create({
        username,
        email,
        password,
        fullname,
        avatar:avtarUpload.url,
        coverimage:coverImageUpload.url
       });

       
     res.json(new ApiResponse(201,cuser.username,"user created succesfully"))

       } catch (error) {
        
        throw new ApiError(500,"error while creating user")
       }

        

       
       
       

})

const loginUser = asyncHandler(async(req,res)=>{
     
   
  const {email,password} = req.body
  
    if(!email||!password) throw new ApiError(400,"email and password are required");
   
    const cuser = await user.findOne({email});
   
    if(!cuser) throw new ApiError(400,"user not exist")
      
    const result = await cuser.isPasswordCorrect(password)

       if(!result) throw new ApiError(400,"invalid password")
        
      const accessToken= await cuser.genrateAccessToken();
      const refreshToken= await cuser.genrateRefreshToken();
      
   

      const options = {
        httpOnly:true,
        secure:true,
      }

      return res
      .status(200)
      .cookie("accesstoken",accessToken,options)
      .cookie("refreshtoken",refreshToken,options)
      .json(
        new ApiResponse(200,cuser,
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
    const oldAvtarUrl = req.user.avatar.slice(61,81)

    
    
    await user.findByIdAndUpdate(req.user._id,{$set:{
         avatar:avatarUpload.url
       }},{
        new:true
      })
       
    await delteimageOnCloudnary(oldAvtarUrl)
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

const getUserChannelProfile = asyncHandler( async (req,res) =>{

  const channel = req.params.channel;

  try {
      

    const channeldata = await user.aggregate([
      {
            $match:{
              username:channel.toLowerCase()
            }
      },
      {
        $lookup:{
          from:"subscription",
          localField:"_id",
          foreignField:"channel",
          as:"subscribers",
          
        }
      },
      {
        $lookup:{
          from:'subscription',
          localField:"_id",
          foreignField:"subscriber",
          as:"subscribedTo"
        } 
      },
      {
        $addFields:{
          subscriber:{$size:"$subscribers"},
          subscribedTo:{$size:"$subscribedTo"},
          isSubscribed:{$cond:{
            if:{$in:[req.user?._id,'$subscribers.subscriber']},
            then:true,
            else:false,
          }}
        }
      },
      {
        $project:{
          username:1,
          email:1,
          subscriber:1,
          subscribedTo:1,
          avatar:1,
          coverimage:1,
          isSubscribed:1,
        }
      }
    ])
    if(!channeldata?.length) throw new ApiError(400,"not a valid channel name")
    res.json(new ApiResponse(200,channeldata,"channel data"))

  } catch (error) {

     throw new ApiError(error.statusCode,error.message)
    
  }
    
     

    

})

const userWatchHistory = asyncHandler ( async (req,res) =>{
 
  
 
  try {

    const watchHistory = await user.aggregate([
      {
        $match:{
          username:req.user.username,
        }
      },
      {
        $lookup:{
          from:"video",
          localField:"watchhistory",
          foreignField:"_id",
          as:"watchhistory",
          pipeline:[
            {
              $lookup:{
                from:"user",
                localField:"owner",
                foreignField:"_id",
                as:"ownername",
                pipeline:[{
                  $project:{
                    username:1
                  }
                }]
              }
            },
            {
              $addFields:{
                owner:{
                  $first:"$ownername"
                }
              }
            }
          ]
      
        },
      },
  
    ])

    res.status(200).json(new ApiResponse(200,watchHistory[0].watchhistory,"watch"))
    
  } catch (error) {

    throw new ApiError(500,"server error")
    
  }

})


export {
  registerUser,
  loginUser,
  logOutUser,
  refreshAccessToken,
  changePassword,
  updateUserDetails,
  updateUserAvater,
  updateCoverImage,
  getUserChannelProfile,
  userWatchHistory
}
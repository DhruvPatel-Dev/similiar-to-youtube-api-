import {likeModels as likes} from'../model/likes.model.js'
import ApiError from '../utils/apiError.js'
import ApiResponse from '../utils/ApiResponse.js'
import { asyncHandler } from '../utils/asyncHandler.js'




const toggleVideoLike = asyncHandler(async(req,res)=>{
 try {
    const videoId = req.params?.videoId
if(!videoId) throw new ApiError(404,"video is no there")
       const isLiked  = await likes.findOne({likedBy:req.user._id,video:videoId})
 if(!isLiked)
 {
     await likes.create({
        likedBy:req.user._id,
        video:videoId,
     });
     res.status(201).json(new ApiResponse(201,videoId,"video Liked Successfully"))
 }
 else
 {
    await likes.findByIdAndDelete(isLiked._id)
    res.status(200).json(new ApiResponse(200,"video unliked Successfully"))
 }
 
 } catch (error) {
    throw new ApiError(error.statusCode,error.message)
 }
})

const toggleCommentLike = asyncHandler(async(req,res)=>{
   try {
    const commentId = req.params.commentId;
    if(!commentId) throw new ApiError(404,"no comment is there");
    const isLiked = await likes.findOne({likedBy:req.user._id,comment:commentId})
    if(!isLiked)
    {
        
    await likes.create({
        likedBy:req.user._id,
        comment:commentId
 })
 res.status(201).json(new ApiResponse(201,commentId,"comment Liked Successfully"))
    }
    else
    {
        await likes.findByIdAndDelete(isLiked._id)
        res.status(200).json(new ApiResponse(200,"comment unliked Successfully"))
        
    }
   } catch (error) {
    throw new ApiError(error.statusCode,error.message)
   }
})

const getLikedVideos = asyncHandler(async(req,res)=>{
    try {
    const allLikedVideos = await likes.find({likedBy:req.user._id,comment:undefined})
      
    res.status(200).json(new ApiResponse(200,allLikedVideos,"here is ypur all liked videos"))

    } catch (error) {

    throw new ApiError(error.statusCode,error.message)
        
    }
})
export {toggleVideoLike,getLikedVideos,toggleCommentLike}
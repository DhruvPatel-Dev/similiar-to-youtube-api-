import {likeModel as likes} from'../model/likes.model.js'
import ApiError from '../utils/apiError.js'
import ApiResponse from '../utils/ApiResponse.js'
import { asyncHandler } from '../utils/asyncHandler.js'




const toggleVideoLike = asyncHandler(async(req,res)=>{
 try {
    const videoId = req.params?.videoId
if(!videoId) throw new ApiError(404,"video is no there")
 await likes.create({
    likedBy:req.user._id,
    video:videoId,
 });
 res.status(201).json(new ApiResponse(201,videoId,"video Liked Successfully"))
 } catch (error) {
    throw new ApiError(error.statusCode,error.message)
 }
})

const toggleCommentLike = asyncHandler(async(req,res)=>{
   try {
    const commentId = req.params.commentId;
    if(!commentId) throw new ApiError(404,"no comment is there");

    await likes.create({
       likedBy:req.user._id,
       comment:commentId
})
res.status(201).json(new ApiResponse(201,commentId,"comment Liked Successfully"))
   } catch (error) {
    throw new ApiError(error.statusCode,error.message)
   }
})

const getLikedVideos = asyncHandler(async(req,res)=>{
    try {
    const allLikedVideos = await likes.aggregate([
            {
                $match:{
                    likedBy:req.user._id,
                    comment:undefined
                }
            },
            {
                $lookup:{
                    from:'videos',
                    localField:"video",
                    foreignField:"_id",
                    as:"video",
                    pipeline:[
                        {
                            $lookup:{
                                from:"users",
                                localField:"owner",
                                foreignField:"_id",
                                as:"owner",
                                pipeline:[
                                    {
                                        $project:{
                                            username:1
                                        }
                                    }
                                ]
                            }
                        },
                       
                    ]
                }
            },
            {
                $project:{
                    video:1
                }
            }
            
        ])
      
    res.status(200).json(new ApiResponse(200,allLikedVideos,"here is ypur all liked videos"))

    } catch (error) {

    throw new ApiError(error.statusCode,error.message)
        
    }
})
export {toggleVideoLike,getLikedVideos,toggleCommentLike}
import {videos as video} from "../model/video.model.js";
import {likeModels as likeModel } from "../model/likes.model.js";
import {subscriptions as subscription } from "../model/subcription.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/ApiResponse.js";





const getChannelStats = asyncHandler(async(req,res)=>{
   try {
     const allSubscriber = await subscription.aggregate([
           {
            $match:{
                channel:req.user._id
            }
           },
           {
               $count:'subscriber'
           },
        ])
    

   
  res.status(200).json(new ApiResponse(200,{allSubscriber},"your channel stats"))

   } catch (error) {
    throw new ApiError(error.statusCode,error.message)
   }
})

const getChannelVideos = asyncHandler (async(req,res)=>{
     try {
        const allVideos = await video.find({owner:req.user._id})
          if(allVideos.length<1) throw new ApiError(400,"no video Found")
            res.status(200).json(new ApiResponse(200,allVideos,"all videos"))
     } catch (error) {
        throw new ApiError(error.statusCode,error.message)
     }
})


export {getChannelStats,getChannelVideos}
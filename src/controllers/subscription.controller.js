import { subscriptions as subscription } from "../model/subcription.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import ApiResponse from '../utils/ApiResponse.js'
import ApiError from "../utils/apiError.js";




const toggleSubscription = asyncHandler(async(req,res)=>{
      try {
       const isSubscribed = await subscription.findOne({channel:req.params.channelId,subscriber:req.user._id})
       if(isSubscribed) 
       {
        await subscription.findByIdAndDelete(isSubscribed._id)
        res.status(200).json(new ApiResponse(200,"unsubscribed SuccessFully"))
       }
       else
       {
        
        await subscription.create({
            channel:req.params.channelId,subscriber:req.user._id})
           res.status(200).json(new ApiResponse(200,"subscribed SuccessFully"))
       
       }
      } catch (error) {
        throw new ApiError(error.statusCode,error.message)
      }
})

const getAllSubscribedChannel = asyncHandler(async(req,res)=>{
            try {
                const AllChannel = await subscription.find({subscriber:req.params.subscriberId})
                if(!AllChannel) throw new ApiError(400,"no Channel Subscribed")
                res.status(200).json(new ApiResponse(200,AllChannel,"your All Subscribed Channel"))    
            } catch (error) {
                throw new ApiError(error.statusCode.error.message)
            }
})

const getAllSubscribedUser = asyncHandler(async(req,res)=>{
             try {
                const allSubscriber = await subscription.find({channel:req.params.channelId})
                if(!allSubscriber) throw new ApiError(400,"no one has Subscribed Your Channel")
                 res.status(200).json(new ApiResponse(200,allSubscriber,"your All Subscribers"))   
             } catch (error) {
                throw new ApiError(error.statusCode,error.message)
             }
})


export {toggleSubscription,getAllSubscribedChannel,getAllSubscribedUser}
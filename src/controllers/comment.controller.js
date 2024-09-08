import { commentModel as comment } from "../model/comments.model.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";



const createComment = asyncHandler(async(req,res)=>{
         const content = req.body.content
         console.log(content)
 if (!content) throw new ApiError(401,"content is must");
   try {
    await comment.create({
        content,
        owner:req.user._id,
        video:req.params.videoId
    })
    res.status(201).json(new ApiResponse(201,"comment created sucessfully"))
   } catch (error) {
    throw new ApiError(error.statusCode,error.message)
   }
})


export {createComment}
import { commentModel as comment } from "../model/comments.model.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";



const createComment = asyncHandler(async(req,res)=>{
         const content = req.body.content
        
 if (!content) throw new ApiError(401,"content is must");
   try {
   const createdComment = await comment.create({
        content,
        owner:req.user._id,
        video:req.params.videoId
    })
    res.status(201).json(new ApiResponse(201,createdComment,"comment created sucessfully"))
   } catch (error) {
    throw new ApiError(error.statusCode,error.message)
   }
})

const deleteComment = asyncHandler (async(req,res)=>{
     try {
      const deletedComment=  await comment.findByIdAndDelete(req.params.commentId)
      if(!deletedComment) throw new ApiError(400,"comment not Found")
       res.status(200).json(new ApiResponse(200,"comment deleted successfully"))
     } catch (error) {
      throw new ApiError(error.statusCode,error.message)
     }
})

const updateComment = asyncHandler(async(req,res)=>{
 try {
  const content = req.body;
  if(!content) throw new ApiError(400,"content is Mandatory");
const updatedComment = await comment.findByIdAndUpdate(req.params.commentId,content,{new:true})
if(!updatedComment) throw new ApiError(400,"comment is not found")
  res.status(200).json(new ApiResponse(201,updatedComment,"commentd Updated SuccesFully"))
 } catch (error) {
  throw new ApiError(error.statusCode,error.message)
 }
})

const getVideoComments = asyncHandler(async(req,res)=>{
 
   try {
   const allComments = await comment.find({video:req.params.videoId})
 
       if(!allComments) throw new ApiError(400,"no comment on Videos")
      res.status(200).json(new ApiResponse(201,allComments,'all comments On videos'))
   } catch (error) {
    throw new ApiError(error.statusCode,error.message)
   }      
})


export {createComment,deleteComment,updateComment,getVideoComments}
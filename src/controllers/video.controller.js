import video from "../model/video.model.js"
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import {asyncHandler }from "../utils/asyncHandler.js"
import { deleteOnCloudnary, uploadOnCloudnary } from "../utils/cloudnary.js";



const getAllVideos = asyncHandler(async (req,res)=>{
       
    try {
     const allVideos = await video.aggregate([
      {
         $match:{
            owner:req.user._id
         }
      },
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
               },
            ]
         }
      },
      {
         $addFields:{
          owner:{
            $first:"$owner"
          }
         }
      }

     
     ])
     if(allVideos.length<1) throw new ApiError(400,"no video is uploaded by you")
    return  res.status(200).json(new ApiResponse(200,allVideos,"all Videos Fetched Successfully"));
    } catch (error) {
      throw new ApiError(error.statusCode,error.message)
    }

     
})

const publishVideo = asyncHandler(async (req,res)=>{
   
    const {title,description}  = req.body;

    const videoFilePath = req.files?.videoFile[0]?.path;
    const thumbNailFilePath = req.files?.thumbNail[0]?.path;

    if(!videoFilePath||!thumbNailFilePath||!title||!description) throw new ApiError(400,"All field Are mandatory");

    const videoCloudnaryPath = await uploadOnCloudnary(videoFilePath);
    const thumbNailCloudnaryPath  = await uploadOnCloudnary(thumbNailFilePath);
   
    
     try {
        const uploadedVideo =  await video.create({
          
            videofile:videoCloudnaryPath.url,
            thumbnail:thumbNailCloudnaryPath.url,
            description,
            title,
            Duration:videoCloudnaryPath.duration,
            isPublished:true,
            owner:req.user._id,
    
        })
    
       return res.status(201).json(new ApiResponse(201,uploadedVideo,"video Uploaded succesfully"))
     } catch (error) {
        throw new ApiError(error.statusCode,"error while uploading Video")
        
     }

})

const getVideoById  = asyncHandler(async(req,res)=>{
 
   try {
      const cvideo = await video.findById(req.params.videoId)
      if(!cvideo) throw new ApiError(400,"not a valid video id")
      res.status(200).json(new ApiResponse(201,cvideo,"video Fetched Successfully"))
      
   } catch (error) {
      throw new ApiError(error.statusCode,error.message)
   }
  
})

const deleteVideo = asyncHandler ( async (req,res) => {
 
   try {
      const cvideo =  await video.findById(req.params.videoId)
      if(!cvideo) throw new ApiError(400,"Video Not Found")
      const videoCloudPath = cvideo.videofile.slice(61).split('.')
      const thumbnailCloudPath = cvideo.thumbnail.slice(61).split('.')
      
       await deleteOnCloudnary(videoCloudPath[0],thumbnailCloudPath[0])
      await video.findByIdAndDelete(req.params.videoId)   

      res.status(200).json(new ApiResponse(200,cvideo.title,"video Delted Successfully"))
   
   } catch (error) {
      throw new ApiError(error.statusCode,error.message)
   
   }
})

const updateVideo = asyncHandler( async (req,res)=>{
try {
   
   const cvideo = await video.findById(req.params.videoId)
    if(!cvideo) throw new ApiError(400,"video not found");
    

    const videoLocalPath = req.file?.path
    if(!videoLocalPath) throw new ApiError(400,"please provide a video to be Updated")

    const videoCloudnary =await uploadOnCloudnary(videoLocalPath);
    const cloudpath = cvideo.videofile.slice(61).split('.')
    await deleteOnCloudnary(cloudpath[0])
    
    await video.findByIdAndUpdate(req.params.videoId,{videofile:videoCloudnary.url},{new:true})
} catch (error) {
 throw new ApiError(error.statusCode,error.message)
   
}

})


export {getAllVideos,publishVideo,getVideoById,deleteVideo,updateVideo}
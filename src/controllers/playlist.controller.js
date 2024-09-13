import { asyncHandler } from "../utils/asyncHandler.js";
import { playlists as playlist } from "../model/playlist.model.js";
import ApiError from '../utils/apiError.js'
import ApiResponse from '../utils/ApiResponse.js'

const createPlaylist = asyncHandler(async(req,res)=>{

try {
    const {name,description} = req.body;
    console.log(name)
    if(!name) throw new ApiError(401,"name is mandotaory");

    const createdPlaylist = await playlist.create({
        name,
        description,
        owner:req.user._id
    })
    res.status(201).json(new ApiResponse(201,createdPlaylist,"playlist Created Successfully"))
} catch (error) {
    throw new ApiError(error.statusCode,error.message)
}

})

const getplaylistById = asyncHandler(async(req,res)=>{

   try {
    const cplaylist = await playlist.findById(req.params.playlistId)
    if(!cplaylist) throw new ApiError(400,"playlist not found") 
    res.status(201).json(new ApiResponse(201,cplaylist,"playlist founded"))
   } catch (error) {
    throw new ApiError(error.statusCode,error.message)
   }


})

const deletePlaylist = asyncHandler( async(req,res)=>{
try {
    const deletedPlaylist =  await playlist.findByIdAndDelete(req.params.playlistId)
     if(!deletedPlaylist) throw new ApiError(400,"playlist Not Found")
    res.status(200).json(new ApiResponse(200,"playlist delted successfully"))
} catch (error) {
    throw new ApiError(error.statusCode,error.message)
}
})

const getUserPlaylists = asyncHandler (async(req,res)=>{

    try {
    const allPlayList = await playlist.find({owner:req.params.userId})
    if(!allPlayList) throw new ApiError(400,"No playlist found")
     res.status(201).json(new ApiResponse(201,allPlayList,"playlist of given UserId"))
    } catch (error) {
        throw new ApiError(error.statusCode,error.message)
    }
})

const updatePlaylist = asyncHandler (async(req,res)=>{

     
    try {
        const {name,description} =  req.body;
      
        if(!name&&!description) throw new ApiError(401,"you need to change something")
            
      const updatedPlaylist =await playlist.findByIdAndUpdate(req.params.playlistId,{name,description},{new:true})  
    if(!updatedPlaylist) throw new ApiError(400,"playlist not found")
         res.status(201).json(new ApiResponse(201,"playlist updated succesfully"))
   
    } catch (error) {
        throw new ApiError(error.statusCode,error.message)
    }

})

const addVideoToPlaylist = asyncHandler(async(req,res)=>{
       
    try {
     await playlist.updateOne({_id:req.params.playlistId},{$push:{videos:req.params.videoId}})
        res.status(200).json(new ApiResponse(200,"video Added Successfully"))
    } catch (error) {
        throw new ApiError(error.statusCode,error.message)
    }

})
const removeVideoFromPlaylist = asyncHandler(async(req,res)=>{
     try {
      await playlist.updateOne({_id:req.params.playlistId},{$pull:{videos:req.params.videoId}})
      res.status(200).json(new ApiResponse(200,"video deleted Successfully"))
     } catch (error) {
        
     }
})



export {getUserPlaylists,
    getplaylistById,
    deletePlaylist,
    addVideoToPlaylist,
    updatePlaylist,
    removeVideoFromPlaylist,
    createPlaylist
}


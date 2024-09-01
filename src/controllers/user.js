
import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js"
import {user} from "../model/user.model.js"
import { uploadOnCloudnary } from "../utils/cloudnary.js";
import ApiResponse from "../utils/ApiResponse.js";


const registerUser = asyncHandler( async (req,res)=>{
    
    const {username,email,fullname,password} = req.body;

    if(!(username||fullname||email||password))
        {
            throw new ApiError(400,"All field are mandatory")
        }    

      const existeduser = await user.findOne({

            $or:[{username},{email}]
        })

        if(existeduser)
        {
            throw new ApiError(409,"USER ALREADY EXIST");
        }

       
        const avatarLocalpath = req.files?.avatar[0]?.path  
        const coverimageLocalpath = req.files?.coverimage[0]?.path  
        if(!(avatarLocalpath||coverimageLocalpath))
            {
                throw new ApiError(400,"avatar and coverimage required");
            } 

        const avtar = await uploadOnCloudnary(avatarLocalpath)
        const coverimage = await uploadOnCloudnary(coverimageLocalpath);


      const cuser =  await user.create({
            username,
            email,
            password,
            fullname,
            avatar:avtar.url,
            coverimage:coverimage.url
        });

        const createduser = await user.findById(cuser._id).select("-password -refreshtoken");

        if(!createduser)
        {
            throw new ApiError(500,"something went wrong while createing user");

        }
           
       return res.status(200).json( new ApiResponse(200,createduser,"user registerd successfuly"));
       

})














export {registerUser}
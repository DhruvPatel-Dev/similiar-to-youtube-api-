import fs, { unlink } from "node:fs";
import { v2 as cloudinary } from 'cloudinary';
import ApiError from "./apiError.js";
import { response } from "express";

    // Configuration
    cloudinary.config({ 
        cloud_name: 'dzx3ww3jf', 
        api_key: process.env.CLOUDNARY_API_KEY, 
        api_secret:process.env.CLOUDNARY_API_SECRET // Click 'View API Keys' above to copy your API secret
    });
    
  
    const uploadOnCloudnary = async (localFilePath) =>{

        try {
            if(!localFilePath) return null;

            const cloudnaryResponse = await cloudinary.uploader.upload(localFilePath,{
                resource_type:"auto"
            })
            return cloudnaryResponse;
            
        } catch (error) {

            fs.unlinkSync(localFilePath);
            throw new ApiError(500,"error while uploafing")
        }

    }
    const deleteOnCloudnary = async (...cloudnaryPath) =>{

      try {
        cloudinary.api
        .delete_resources(cloudnaryPath, 
          { type: 'upload', resource_type: 'video' })
        
      } catch (error) {
        throw new ApiError(error.statusCode,error.message)
        
      }
       
    }
    const delteimageOnCloudnary  = async (...cloudnaryPath) =>{

        try {
            cloudinary.api
            .delete_resources(cloudnaryPath, 
              { type: 'upload',resource_type:'image'})

          
        } catch (error) {
          throw new ApiError(error.statusCode,error.message)
          
        }
         
      }


    export {uploadOnCloudnary,deleteOnCloudnary,delteimageOnCloudnary}
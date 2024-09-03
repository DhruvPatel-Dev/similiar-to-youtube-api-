import fs from "node:fs";
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
             
            fs.unlinkSync(localFilePath)
            return cloudnaryResponse;
            
        } catch (error) {

            fs.unlinkSync(localFilePath);
            throw new ApiError(500,"error while uploafing")
        }
    }
    const deleteOnCloudnary = async (cloudnaryPath) =>{

        try {
            if(!cloudnaryPath) return null;
         
           await cloudinary.uploader.destroy(cloudnaryPath, function(error, result) {
                if (error) {
                  throw new ApiError(400,error.message)
                } else {
                 return result
                }
              });
          
        } catch (error) {

           throw new ApiError(error.statusCode,error.message)
        }
    }


    export {uploadOnCloudnary,deleteOnCloudnary}
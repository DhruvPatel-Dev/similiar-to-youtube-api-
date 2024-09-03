import { Router } from "express";
import {        registerUser,
                loginUser,
                logOutUser,
                refreshAccessToken,
                changePassword,
                updateUserDetails,
                updateUserAvater,
                updateCoverImage
    } from "../controllers/user.js";
import { upload } from "../middleware/multer.js";
import { verifyJWT } from "../middleware/auth.js";

const router = Router()


router.post('/register',upload.fields([{
    name:"avatar",
    maxCount:1,
},
{
    name:"coverimage",
    maxCount:1,
}]),
registerUser)
router.post('/login',loginUser);
router.patch('/refresh-token',refreshAccessToken);

router.use(verifyJWT)
router.post('/logout',logOutUser);
router.patch('/changepassword',changePassword)
router.patch('/updateuserdetails',updateUserDetails)
router.patch('/updateuseravatar',upload.single('avatar'),updateUserAvater)
router.patch('/updateusercoverimage',upload.single('coverimage'),updateCoverImage)




export default router
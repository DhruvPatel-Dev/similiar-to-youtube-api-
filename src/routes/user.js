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
router.post('/refresh-token',refreshAccessToken);

router.use(verifyJWT)
router.post('/logout',logOutUser);
router.post('/changepassword',changePassword)
router.post('/updateuserdetails',updateUserDetails)
router.post('/updateuseravatar',upload.single('avatar'),updateUserAvater)
router.post('/updateusercoverimage',upload.single('coverimage'),updateCoverImage)




export default router
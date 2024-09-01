import { Router } from "express";
import { registerUser } from "../controllers/user.js";
import { upload } from "../middleware/multer.js";

const router = Router()


router.post('/register',upload.fields([{
    name:"avatar",
    maxCount:1,
},
{
    name:"coverimage",
    maxCount:1,
}]),registerUser)




export default router
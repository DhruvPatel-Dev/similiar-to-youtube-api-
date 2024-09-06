import { Router } from "express";
import { verifyJWT } from "../middleware/auth.js";
import { upload } from "../middleware/multer.js";
import { getAllVideos,deleteVideo,getVideoById,updateVideo,publishVideo } from "../controllers/video.controller.js";


const router = Router();



router.use(verifyJWT)

router.route('/').
get(getAllVideos).
post(upload.fields([
    {
        name:"videoFile",
        maxCount:1,
    },
    {
        name:"thumbNail",
        maxCount:1
    }
]),
publishVideo);

router.
route('/:videoId').
get(getVideoById).delete(deleteVideo).patch(upload.single("video"),updateVideo)





export default router;
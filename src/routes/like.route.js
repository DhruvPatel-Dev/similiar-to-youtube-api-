import { Router } from "express";
import { verifyJWT } from "../middleware/auth.js";
import { toggleVideoLike,toggleCommentLike,getLikedVideos } from "../controllers/like.controller.js";
const router = Router();

router.use(verifyJWT)
router.route('/toggle/v/:videoId').post(toggleVideoLike);
router.route('/toggle/c/:commentId').post(toggleCommentLike);
router.route('/videos').get(getLikedVideos)

export default router
import { Router } from "express";
import { verifyJWT } from "../middleware/auth.js";
import { createComment, deleteComment, getVideoComments, updateComment } from "../controllers/comment.controller.js";

const router = Router()


router.use(verifyJWT)
router.route('/:videoId').post(createComment).get(getVideoComments)
router.route('/c/:commentId').patch(updateComment).delete(deleteComment)


export default router
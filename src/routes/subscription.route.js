import { Router } from "express";
import { verifyJWT } from "../middleware/auth.js";
import { getAllSubscribedChannel, getAllSubscribedUser, toggleSubscription } from "../controllers/subscription.controller.js";


const router = Router()

router.use(verifyJWT)

router.route('/c/:channelId').get(getAllSubscribedUser).post(toggleSubscription);
router.route('/u/:subscriberId').get(getAllSubscribedChannel)





export default router
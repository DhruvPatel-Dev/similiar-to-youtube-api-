import { Router } from "express";
import { verifyJWT } from "../middleware/auth.js";
import { 
    addVideoToPlaylist,
     createPlaylist,
      deletePlaylist,
       getplaylistById,
        getUserPlaylists,
         removeVideoFromPlaylist,
          updatePlaylist } from "../controllers/playlist.controller.js";
const router = Router();




router.use(verifyJWT)


router.route('/').post(createPlaylist)

router.route('/:playlistId')
.get(getplaylistById)
.delete(deletePlaylist)
.patch(updatePlaylist)

router.route('/add/:videoId/:playlistId').patch(addVideoToPlaylist);
router.route('/remove/:videoId/:playlistId').patch(removeVideoFromPlaylist)

router.route('/user/:userId').get(getUserPlaylists);

export default router;








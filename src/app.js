import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}));

app.use(express.json());
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser());


import userRouter from './routes/user.js';
import videoRouter from'./routes/video.route.js';
import likeRouter from './routes/like.route.js'
import commentRouter from './routes/comment.route.js'
import playlistRouter from './routes/playlist.route.js'
import subscriptionsRouter from './routes/subscription.route.js'

app.use('/api/users',userRouter)
app.use('/api/videos',videoRouter)
app.use('/api/likes',likeRouter)
app.use('/api/comments',commentRouter)
app.use('/api/playlists',playlistRouter)
app.use('/api/subscriptions',subscriptionsRouter)

export {app}
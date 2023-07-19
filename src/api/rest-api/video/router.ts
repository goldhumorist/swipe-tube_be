import express from 'express';
import controllers from './controllers';
import sessionController from '../session/controllers';

const router = express.Router();

const checkSession = sessionController.session.checkSessionMiddleware;

router.get('/my-videos', checkSession, controllers.videos.myVideos);
router.get('/swipe-videos', checkSession, controllers.videos.swipeVideos);
router.post('/upload', checkSession, controllers.videos.uploadVideo);
router.post('/add-video-view', checkSession, controllers.videos.addVideoView);

export default router;

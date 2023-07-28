import { FastifyPluginCallback } from 'fastify';
import controllers from './controllers';
import sessionController from '../session/controllers';

const checkSession = {
  preHandler: sessionController.session.checkSessionMiddleware,
};

const videoRouter: FastifyPluginCallback = (app, opts, done) => {
  app.get('/my-videos', checkSession, controllers.videos.myVideos);
  app.get('/liked-videos', checkSession, controllers.videos.likedVideos);
  app.get('/swipe-videos', checkSession, controllers.videos.swipeVideos);
  app.post('/upload', checkSession, controllers.videos.uploadVideo);
  app.post('/add-video-view', checkSession, controllers.videos.addVideoView);
  app.post(
    '/update-video-reaction',
    checkSession,
    controllers.videos.updateVideoReaction,
  );

  done();
};

export default videoRouter;

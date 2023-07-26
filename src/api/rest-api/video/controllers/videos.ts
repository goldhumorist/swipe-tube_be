import { filterFileType } from './../../../utils';
import MyVideos from '../../../../use-cases/video/my-videos';
import LikedVideos from '../../../../use-cases/video/liked-videos';
import UploadVideo from '../../../../use-cases/video/upload';
import SwipeVideos from '../../../../use-cases/video/swipe-videos';
import UpdateVideoReaction from '../../../../use-cases/video/update-video-reaction';
import AddSwipeVideosView from '../../../../use-cases/video/add-swipe-videos-view';
import { chista } from '../../../utils';
import {
  AVAILABLE_VIDEO_MIMETYPES,
  ERROR_CODE,
  FILE_SIZE_LIMIT,
} from '../../../../global-help-utils/enums';
import multer, { MulterError } from 'fastify-multer';
import { loggerFactory } from '../../../../infrastructure/logger';
import { IRequestWithFile, IRequestWithSession } from '../../interfaces';
import { FastifyReply, FastifyInstance } from 'fastify';

const logger = loggerFactory.getLogger(__filename);

const upload = multer({
  limits: { fileSize: FILE_SIZE_LIMIT.TEN_MEGABYTES },
  fileFilter: filterFileType(AVAILABLE_VIDEO_MIMETYPES),
});

export default {
  myVideos: chista.makeUseCaseRunner(MyVideos, (req: IRequestWithSession) => ({
    ...req.session?.context,
    ...(req.query || {}),
  })),

  likedVideos: chista.makeUseCaseRunner(
    LikedVideos,
    (req: IRequestWithSession) => ({
      ...req.session?.context,
      ...(req.query || {}),
    }),
  ),

  addVideoView: chista.makeUseCaseRunner(
    AddSwipeVideosView,
    (req: IRequestWithSession) => ({
      ...req.session?.context,
      ...(req.body || {}),
    }),
  ),

  swipeVideos: chista.makeUseCaseRunner(
    SwipeVideos,
    (req: IRequestWithSession) => ({
      ...req.session?.context,
      ...(req.query || {}),
    }),
  ),

  updateVideoReaction: chista.makeUseCaseRunner(
    UpdateVideoReaction,
    (req: IRequestWithSession) => ({
      ...req.session?.context,
      ...(req.body || {}),
    }),
  ),

  uploadVideo: async (req: IRequestWithSession, res: FastifyReply) => {
    try {
      await new Promise<void>((resolve, reject) => {
        upload.single('video').bind(this as unknown as FastifyInstance)(
          req,
          res,
          err => (err ? reject(err) : resolve()),
        );
      });

      const { file } = req as IRequestWithFile;

      const promise = chista.runUseCase(UploadVideo, {
        params: {
          ...req.session?.context,
          file,
        },
      });

      await chista.renderPromiseAsJson(req, res, promise);
    } catch (error: any) {
      logger.error('Upload Video Error', error);

      const errorResponse = {
        status: 0,
        error: {
          code: ERROR_CODE.SERVER_ERROR,
          message: error.message || error.code,
        },
      };

      if (error instanceof MulterError)
        errorResponse.error.code = ERROR_CODE.BAD_REQUEST;

      res.send(errorResponse);
    }
  },
};

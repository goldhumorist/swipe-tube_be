import { FastifyReply } from 'fastify';
import { filterFileType, filterFileSize, chista } from '../../../utils';
import MyVideos from '../../../../use-cases/video/my-videos';
import LikedVideos from '../../../../use-cases/video/liked-videos';
import UploadVideo from '../../../../use-cases/video/upload';
import SwipeVideos from '../../../../use-cases/video/swipe-videos';
import UpdateVideoReaction from '../../../../use-cases/video/update-video-reaction';
import AddSwipeVideosView from '../../../../use-cases/video/add-swipe-videos-view';
import { IFile } from './../../../../use-cases/interface';
import {
  AVAILABLE_VIDEO_MIMETYPES,
  ERROR_CODE,
  FILE_SIZE_LIMIT_IN_MB,
  Exception,
} from '../../../../global-help-utils';
import { loggerFactory } from '../../../../infrastructure/logger';
import { IRequestWithSession, IUploadVideoBody } from '../../interfaces';

const logger = loggerFactory.getLogger(__filename);

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
      const file = (req.body as IUploadVideoBody).video;
      const fileBuffer = await file.toBuffer();

      filterFileType(file.mimetype, AVAILABLE_VIDEO_MIMETYPES);
      filterFileSize(fileBuffer, FILE_SIZE_LIMIT_IN_MB.TEN_MEGABYTES);

      const fileForUseCase: IFile = {
        buffer: fileBuffer,
        mimetype: file.mimetype,
        encoding: file.encoding,
        originalname: file.filename,
      };

      const promise = chista.runUseCase(UploadVideo, {
        params: {
          ...req.session?.context,
          file: fileForUseCase,
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

      if (error instanceof Exception) errorResponse.error = error.toResponse();

      res.send(errorResponse);
    }
  },
};

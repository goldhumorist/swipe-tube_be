import { filterFileType } from './../../../utils';
import MyVideos from '../../../../use-cases/video/my-videos';
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
import { Response } from 'express';
import multer, { MulterError } from 'multer';
import { loggerFactory } from '../../../../infrastructure/logger';
import { IRequest } from '../../interfaces';

const logger = loggerFactory.getLogger(__filename);

const upload = multer({
  limits: { fileSize: FILE_SIZE_LIMIT.TEN_MEGABYTES },
  fileFilter: filterFileType(AVAILABLE_VIDEO_MIMETYPES),
});

export default {
  myVideos: chista.makeUseCaseRunner(MyVideos, (req: IRequest) => ({
    ...req.session?.context,
    ...req.query,
  })),

  addVideoView: chista.makeUseCaseRunner(
    AddSwipeVideosView,
    (req: IRequest) => ({
      ...req.session?.context,
      ...req.body,
    }),
  ),

  swipeVideos: chista.makeUseCaseRunner(SwipeVideos, (req: IRequest) => ({
    ...req.session?.context,
    ...req.query,
  })),

  updateVideoReaction: chista.makeUseCaseRunner(
    UpdateVideoReaction,
    (req: IRequest) => ({
      ...req.session?.context,
      ...req.body,
    }),
  ),

  uploadVideo: async (req: IRequest, res: Response) => {
    try {
      await new Promise<void>((resolve, reject) => {
        upload.single('video')(req, res, err =>
          err ? reject(err) : resolve(),
        );
      });

      const { file } = req;

      const promise = chista.runUseCase(UploadVideo, {
        params: {
          ...req.session?.context,
          file,
        },
      });

      chista.renderPromiseAsJson(req, res, promise);
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

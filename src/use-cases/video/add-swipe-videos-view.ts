import { Database } from '../../domain-model/index';
import { VideoStatistic } from '../../domain-model/video-statistic.model';
import { IVideoViews, VideoViews } from '../../domain-model/video-views.model';
import { loggerFactory } from '../../infrastructure/logger';
import {
  IVideoViewsDumpedResponse,
  IVideoViewsFullResponse,
  IVideoViewsParams,
} from '../interface';
import UseCaseBase from '../base';
import { NotUniqueX } from '../../domain-model/domain-model-exception';
import { ERROR_CODE, Exception } from '../../global-help-utils';

const logger = loggerFactory.getLogger(__filename);

export default class AddSwipeVideosView extends UseCaseBase<
  IVideoViewsParams,
  IVideoViewsFullResponse
> {
  static validationRules = {
    userId: ['required'],
    videoId: ['required'],
  };

  async execute(data: IVideoViewsParams): Promise<IVideoViewsFullResponse> {
    const transaction = await Database.getInstance().transaction();

    try {
      const { videoId, userId } = data;

      const videoViews = await VideoViews.addViewForVideo(
        {
          userId,
          videoId,
        },
        transaction,
      );

      const videoViewsAmount = await VideoStatistic.incrementVideoViews(
        videoId,
        transaction,
      );

      const result = {
        ...this.dumpVideoViews(videoViews),
        views: videoViewsAmount,
      };

      await transaction.commit();

      return { data: result };
    } catch (error: any) {
      await transaction.rollback();

      if (error instanceof NotUniqueX)
        throw new Exception({
          code: ERROR_CODE.NOT_UNIQUE,
          message: error.message,
        });

      throw error;
    }
  }

  dumpVideoViews(videoViews: IVideoViews): IVideoViewsDumpedResponse {
    const dumpedResponse: IVideoViewsDumpedResponse = {
      videoId: videoViews.videoId,
      userId: videoViews.userId,
    };

    return dumpedResponse;
  }
}

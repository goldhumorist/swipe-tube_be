import { VideoStatistic } from './../../domain-model/video-statistic.model';
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

export default class SwipeVideosViews extends UseCaseBase<
  IVideoViewsParams,
  IVideoViewsFullResponse
> {
  static validationRules = {
    userId: ['required'],
    videoId: ['required'],
  };

  async execute(data: IVideoViewsParams): Promise<IVideoViewsFullResponse> {
    try {
      const { videoId, userId } = data;

      const videoViews = await VideoViews.addViewForVideo(userId, videoId);

      const viewsAmount = await VideoViews.countViews(videoId);

      await VideoStatistic.updateStatistic(videoId, viewsAmount);

      const result = {
        ...this.dumpVideoViews(videoViews),
        views: viewsAmount,
      };

      return {
        data: result,
      };
    } catch (error: any) {
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
      userId: videoViews.authorId,
    };

    return dumpedResponse;
  }
}

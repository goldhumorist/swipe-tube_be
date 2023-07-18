import { VideoStatistic } from './../../domain-model/video-statistic.model';
import { IVideoViews, VideoViews } from '../../domain-model/video-views.model';
import { loggerFactory } from '../../infrastructure/logger';
import {
  IVideoViewsDumpedResponse,
  IVideoViewsFullResponse,
  IVideoViewsParams,
} from '../interface';
import UseCaseBase from '../base';

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
    const { videoId, userId } = data;

    const videoViews = await VideoViews.create({
      authorId: userId,
      videoId: videoId,
    });

    const { views } = await VideoViews.countViews(videoId);

    await VideoStatistic.updateStatistic(videoId, views);

    return {
      data: {
        ...this.dumpVideoViews(videoViews),
        views: views,
      },
    };
  }

  dumpVideoViews(videoViews: IVideoViews): IVideoViewsDumpedResponse {
    const dumpedResponse: IVideoViewsDumpedResponse = {
      videoId: videoViews.videoId,
      userId: videoViews.authorId,
    };

    return dumpedResponse;
  }
}

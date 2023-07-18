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
    const videoViews = await VideoViews.create({
      authorId: data.userId,
      videoId: data.videoId,
    });

    const { views } = await VideoViews.countViews(data.videoId);

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

import { ISwipeVideosResponse } from '../../domain-model/interfaces';
import { Video } from '../../domain-model/video.model';
import { loggerFactory } from '../../infrastructure/logger';
import {
  ISwipeVideosDumpedResponse,
  ISwipeVideosFullResponse,
  ISwipeVideosParams,
} from '../interface';
import UseCaseBase from '../base';

const logger = loggerFactory.getLogger(__filename);

export default class SwipeVideos extends UseCaseBase<
  ISwipeVideosParams,
  ISwipeVideosFullResponse
> {
  static validationRules = {
    userId: ['required'],
    page: ['required', 'positive_integer'],
    mainLimit: ['required', 'positive_integer', { max_number: 50 }],
    itemLimit: ['required', 'positive_integer', { max_number: 50 }],
  };

  async execute(data: ISwipeVideosParams): Promise<ISwipeVideosFullResponse> {
    const videos = await Video.listVideosForSwipe(data);

    return { data: this.dumpVideos(videos) };
  }

  dumpVideos(data: ISwipeVideosResponse): ISwipeVideosDumpedResponse {
    const { pagination, videos } = data;

    return {
      pagination: pagination,
      videos: videos.map(video => {
        return {
          videoUrlPath: video.videoUrlPath,
          thumbnailUrlPath: video.thumbnailUrlPath,
          description: video.description,
        };
      }),
    };
  }
}

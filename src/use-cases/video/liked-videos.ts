import { ILikedVideosResponse } from '../../domain-model/interfaces';
import { Video } from '../../domain-model/video.model';
import { loggerFactory } from '../../infrastructure/logger';
import {
  ILikedVideosParams,
  ILikedVideosFullResponse,
  ILikedVideosDumpedResponse,
} from '../interface';
import UseCaseBase from '../base';

const logger = loggerFactory.getLogger(__filename);

export default class LikedVideos extends UseCaseBase<
  ILikedVideosParams,
  ILikedVideosFullResponse
> {
  static validationRules = {
    userId: ['required'],
    page: ['required', 'positive_integer'],
    limit: ['required', 'positive_integer', { max_number: 50 }],
  };

  async execute(data: ILikedVideosParams): Promise<ILikedVideosFullResponse> {
    const videos = await Video.listLikedVideos(data);

    return { data: this.dumpVideos(videos) };
  }

  dumpVideos(data: ILikedVideosResponse): ILikedVideosDumpedResponse {
    const { pagination, videos } = data;

    return {
      pagination: pagination,
      videos: videos.map(video => {
        return {
          videoUrlPath: video.videoUrlPath,
          thumbnailUrlPath: video.thumbnailUrlPath,
          description: video.description,
          statistic: {
            views: video.videoStatistic?.viewsAmount,
            likes: video.videoStatistic?.likesAmount,
            dislikes: video.videoStatistic?.dislikesAmount,
          },
        };
      }),
    };
  }
}

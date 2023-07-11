import { IMyVideosResponse } from './../../domain-model/interfaces';
import { Video } from './../../domain-model/video.model';
import { loggerFactory } from './../../infrastructure/logger';
import {
  IMyVideosParams,
  IMyVideosFullResponse,
  IMyVideosDumpedResponse,
} from '../interface';
import UseCaseBase from '../../base';

const logger = loggerFactory.getLogger(__filename);

export default class MyVideos extends UseCaseBase<
  IMyVideosParams,
  IMyVideosFullResponse
> {
  static validationRules = {
    userId: ['required'],
    page: ['required', 'positive_integer'],
    limit: ['required', 'positive_integer', { max_number: 50 }],
  };

  async execute(data: IMyVideosParams): Promise<IMyVideosFullResponse> {
    const videos = await Video.listMyVideos(data);

    return { data: this.dumpVideos(videos) };
  }

  dumpVideos(data: IMyVideosResponse): IMyVideosDumpedResponse {
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

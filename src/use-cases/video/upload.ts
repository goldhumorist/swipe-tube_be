import { Database } from './../../domain-model/index';
import { IVideo, Video } from './../../domain-model/video.model';
import { FILES_PREFIX } from './../../global-help-utils/enums';
import {
  IUploadVideoFullResponse,
  IUploadVideoDumpedResponse,
} from './../interface';
import { loggerFactory } from './../../infrastructure/logger';
import { IUploadVideoParams } from '../interface';
import UseCaseBase from '../base';
import { s3Client } from './../../infrastructure/s3';
import { v4 as uuidV4 } from 'uuid';
import path from 'path';
import { videoService } from '../utils/video';
import { VideoStatistic } from './../../domain-model/video-statistic.model';

const logger = loggerFactory.getLogger(__filename);

export default class UploadVideo extends UseCaseBase<
  IUploadVideoParams,
  IUploadVideoFullResponse
> {
  static validationRules = {
    file: ['required'],
    description: 'string',
    userId: ['required'],
  };

  async execute(data: IUploadVideoParams): Promise<IUploadVideoFullResponse> {
    const { file: video, userId, description } = data;

    const transaction = await Database.getInstance().transaction();

    try {
      const v4 = uuidV4();
      const extention = path.extname(video.originalname);
      const videoFileName = `${FILES_PREFIX.VIDEO}_${v4}${extention}`;
      const thumbnailFileName = `${FILES_PREFIX.THUMBNAIL}_${v4}.jpg`;

      const thumbnailBuffer = await videoService.createThumbnailForVideo(
        video.buffer,
      );

      const savedVideo = await Video.create(
        {
          authorId: userId,
          description,
          videoUrlPath: videoFileName,
          thumbnailUrlPath: thumbnailFileName,
        },
        { transaction },
      );

      await VideoStatistic.create(
        {
          videoId: savedVideo.id,
        },
        { transaction },
      );

      await s3Client.uploadFileToS3({
        key: videoFileName,
        body: video.buffer,
        contentType: video.mimetype,
      });

      await s3Client.uploadFileToS3({
        key: thumbnailFileName,
        body: thumbnailBuffer,
        contentType: 'image/jpg',
      });

      await transaction.commit();

      return { data: this.dumpVideo(savedVideo) };
    } catch (error) {
      await transaction.rollback();

      throw error;
    }
  }

  dumpVideo(video: IVideo): IUploadVideoDumpedResponse {
    const dumpedResponse: IUploadVideoDumpedResponse = {
      videoUrlPath: video.videoUrlPath,
      thumbnailUrlPath: video.thumbnailUrlPath,
    };

    if (video.description) dumpedResponse.description = video.description;

    return dumpedResponse;
  }
}

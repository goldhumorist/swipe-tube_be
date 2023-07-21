import { IVideoStatistic } from './../domain-model/video-statistic.model';
import { VideoReactionsEnum } from './../domain-model/video-reactions.model';
import { IVideoMeta, IVideoPagination } from './../domain-model/interfaces';

export interface ISessionDumpedResponse {
  userId?: number;
  email: string;
  username: string;
  avatarUrlPath?: string | null;
}

export interface ISessionCheckParams {
  token: string;
}

export interface ISessionFullResponse {
  data: ISessionDumpedResponse;
}

export interface IFile {
  buffer: Buffer;
  originalname: string;
  size: string;
  encoding: string;
  mimetype: string;
}

export interface IUserSignupParams {
  file: IFile;
  username: string;
  email: string;
  password: string;
}

export interface IUserSignupDumpedResponse {
  userId?: number;
  username: string;
  email: string;
  avatarUrlPath?: string | null;
  accessToken: string;
}

export interface IUserSignupFullResponse {
  data: IUserSignupDumpedResponse;
}

export interface IUserLoginDumpedResponse {
  userId?: number;
  email: string;
  username: string;
  avatarUrlPath?: string | null;
  accessToken: string;
}

export interface IUserLoginFullResponse {
  data: IUserLoginDumpedResponse;
}

export interface IUserLoginParams {
  email: string;
  password: string;
}

export interface IVideoViewsParams {
  userId: number;
  videoId: number;
}

export interface IVideoViewsFullResponse {
  data: {
    views: number;
    userId: number;
    videoId: number;
  };
}

export interface IVideoViewsDumpedResponse {
  userId: number;
  videoId: number;
}

export interface IMyVideosParams {
  userId: number;
  page: number;
  limit: number;
}

export interface IMyVideosDumpedResponse {
  pagination: {
    page: number;
    pageSize: number;
    totalRows: number;
  };
  videos: Array<{
    videoUrlPath: string;
    thumbnailUrlPath: string;
    description?: string | null;
  }>;
}

export interface IMyVideosFullResponse {
  data: IMyVideosDumpedResponse;
}

export interface ISwipeVideosParams {
  userId: number;
  page: number;
  mainLimit: number;
  itemLimit: number;
}

export interface ISwipeVideosDumpedData {
  videoId?: number;
  videoUrlPath: string;
  thumbnailUrlPath: string;
  description?: string | null;
  statistic: {
    views: number;
    likes: number;
  };
}

export interface ISwipeVideosDumpedResponse {
  pagination: IVideoPagination;
  videos: Array<ISwipeVideosDumpedData>;
}

export interface ISwipeVideosFullResponse {
  data: ISwipeVideosDumpedResponse;
}

export interface IUserJWTPayload {
  userId: number;
}

export interface IUploadVideoParams {
  file: IFile;
  description: string;
  userId: number;
}

export interface IUploadVideoDumpedResponse {
  videoUrlPath: string;
  thumbnailUrlPath: string;
  description?: string;
}

export interface IUploadVideoFullResponse {
  data: IUploadVideoDumpedResponse;
}

export interface IUpdateVideoReactionParams {
  userId: number;
  videoId: number;
  reaction: VideoReactionsEnum;
}

export type IVideoMetaWithoutViewed = Omit<IVideoMeta, 'isViewed'>;

export interface IUpdateVideoReactionDumped {
  userId: number;
  videoId: number;
  statistic: {
    likes?: number;
    dislikes?: number;
  };
  metaData: IVideoMetaWithoutViewed;
}

export interface IUpdateVideoReactionDataToDump {
  userId: number;
  videoId: number;
  videoStatistic: IVideoStatistic;
  videoMeta: IVideoMetaWithoutViewed;
}

export interface IUpdateVideoReactionFullResponse {
  data: IUpdateVideoReactionDumped;
}

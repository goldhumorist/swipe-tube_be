import { VideoReactionsEnum } from './video-reactions.model';
import { IVideo } from './video.model';

export interface IDMExceptionData {
  message: string;
  field: string;
  parent?: Error;
}

export interface IVideoStatisticData {
  likesAmount: number;
  dislikesAmount: number;
  viewsAmount: number;
}

export interface IVideoMeta {
  isViewed: boolean;
  isLiked: boolean;
  isDisliked: boolean;
}

export interface IVideoPagination {
  page: number;
  pageSize: number;
  totalRows: number;
}

interface IDataValues {
  [key: string]: string | number;
}

export interface IMyVideosResponse {
  videos: Array<IVideo>;
  pagination: IVideoPagination;
}

export type IVideoMetaRecordResponse = IVideo & {
  videoStatistic: IVideoStatisticData;
} & { metaData: IVideoMeta };

export interface ISwipeVideosResponse {
  videos: Array<IVideoMetaRecordResponse>;
  pagination: IVideoPagination;
}

interface IUserViews {
  userViews: Array<{ id: number }>;
}

interface IUserVideoReactions {
  userVideoReactions: Array<{
    VideoReactions?: { reactionTitle?: VideoReactionsEnum };
  }>;
}

export type IVideoMetaRecord = IVideo & {
  videoStatistic: IVideoStatisticData;
} & IUserViews &
  IUserVideoReactions & {
    dataValues: IDataValues;
  };

export type ISwipeVideoQueryResponse = {
  rows: Array<IVideoMetaRecord>;
  count: number;
};

export interface IListMyVideosData {
  userId: number;
  page: number;
  limit: number;
}

export interface ISwipeVideosData {
  userId: number;
  page: number;
  mainLimit: number;
  itemLimit: number;
}

export interface IUpdateVideoReactionData {
  reactionTitle: VideoReactionsEnum;
  userId: number;
  videoId: number;
}

export interface IUpdateVideoReactionDMResponse {
  previousReactionTitle: VideoReactionsEnum | null;
  newReactionTitle: VideoReactionsEnum | null;
}

export enum VideoLikesActionEnum {
  increase = 'increase',
  descrease = 'descrease',
}

export interface IUpdateVideoLikesParams {
  like?: VideoLikesActionEnum | null;
  dislike?: VideoLikesActionEnum | null;
}

import { IVideo } from './video.model';

export interface IDMExceptionData {
  message: string;
  field: string;
  parent?: Error;
}

export interface IVideoStatistic {
  likesAmount: number;
  viewsAmount: number;
}

export interface IVideoPagination {
  page: number;
  pageSize: number;
  totalRows: number;
}

export interface IMyVideosResponse {
  videos: Array<IVideo>;
  pagination: IVideoPagination;
}

export interface ISwipeVideosResponse {
  videos: Array<IVideoMetaRecord>;
  pagination: IVideoPagination;
}

export type IVideoMetaRecord = IVideo & { videoStatistic: IVideoStatistic };

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

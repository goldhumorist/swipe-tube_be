import { IVideo } from './video.model';

export interface IDMExceptionData {
  message: string;
  field: string;
  parent?: Error;
}

export interface IMyVideosResponse {
  videos: Array<IVideo>;
  pagination: {
    page: number;
    pageSize: number;
    totalRows: number;
  };
}

export type ISwipeVideosResponse = IMyVideosResponse;

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

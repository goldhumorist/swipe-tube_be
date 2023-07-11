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

export interface IListMyVideosData {
  userId: number;
  page: number;
  limit: number;
}

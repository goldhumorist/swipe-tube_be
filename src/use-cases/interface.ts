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

export type ISwipeVideosDumpedResponse = IMyVideosDumpedResponse;

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

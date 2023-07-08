export interface ISessionCheckParams {
  token: string;
}

export interface ISessionFullResponse {
  sessionResponse: {
    userId: number;
  };
}

export interface IUserSignupParams {
  file: {
    buffer: Buffer;
    originalname: string;
    size: string;
    encoding: string;
    mimetype: string;
  };
  username: string;
  email: string;
  password: string;
}

export interface IUserSignupDumpedResponse {
  username: string;
  email: string;
  avatarUrlPath?: string | null;
  accessToken: string;
}

export interface IUserSignupFullResponse {
  data: IUserSignupDumpedResponse;
}

export interface IUserLoginDumpedResponse {
  email: string;
  username: string;
  accessToken: string;
}

export interface IUserLoginFullResponse {
  data: IUserLoginDumpedResponse;
}

export interface IUserLoginParams {
  email: string;
  password: string;
}

export interface IListVideosParams {
  mock: string;
}

export interface IListVideosResponse {
  mock: string;
}

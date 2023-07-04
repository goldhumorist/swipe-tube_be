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
}

export interface IUserSignupFullResponse {
  data: IUserSignupDumpedResponse;
}

import { IUploadFileData } from './../../infrastructure/interfaces';
import {
  IUserSignupFullResponse,
  IUserSignupDumpedResponse,
} from './../interfaces';
import { ERROR_CODE, Exception } from '../../global-help-utils/';
import { NotUniqueX } from './../../domain-model/domain-model-exeption';
import { IUser, User } from './../../domain-model/user.model';
import UseCaseBase from '../base';
import { IUserSignupParams } from '../interfaces';
import { loggerFactory } from './../../infrastructure/logger';
import { S3Client } from './../../infrastructure/s3';
import path from 'path';
import { v4 } from 'uuid';

const logger = loggerFactory.getLogger(__filename);

export default class UserSignup extends UseCaseBase<
  IUserSignupParams,
  IUserSignupFullResponse
> {
  static validationRules = {
    file: 'any_object',
    mimetype: [
      {
        one_of: ['image/jpeg', 'image/jpg', 'image/png'],
      },
    ],
    email: ['required', 'email', { max_length: 255 }, 'to_lc'],
    username: ['required', 'to_lc'],
    password: ['required', { min_length: 12 }],
  };

  async execute(data: IUserSignupParams): Promise<IUserSignupFullResponse> {
    const { file, username, email, password } = data;

    let avatarUrlPath: string | null = null;
    let paramsForUploadingFile!: IUploadFileData;
    let user!: User;

    if (file) {
      const extention = path.extname(file.originalname);
      avatarUrlPath = `image_${v4()}${extention}`;

      paramsForUploadingFile = {
        key: avatarUrlPath,
        body: file.buffer,
        contentType: file.mimetype,
      };
    }

    try {
      const passwordHash = await User._hashPassword(password);

      user = await User.create({
        username,
        email,
        password: passwordHash,
        avatarUrlPath,
      });

      if (file) await S3Client.uploadFileToS3(paramsForUploadingFile);

      return { data: this.dumpUser(user) };
    } catch (error: any) {
      if (error instanceof NotUniqueX)
        throw new Exception({
          code: ERROR_CODE.NOT_UNIQUE,
          message: `'${error.field}' is not unique`,
        });

      await user?.destroyById(user.id);

      throw error;
    }
  }

  dumpUser(user: IUser): IUserSignupDumpedResponse {
    const dumpedResponse: IUserSignupDumpedResponse = {
      username: user.username,
      email: user.email,
    };

    if (user.avatarUrlPath) dumpedResponse.avatarUrlPath = user.avatarUrlPath;

    return dumpedResponse;
  }
}

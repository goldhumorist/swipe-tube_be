import {
  IUserLoginFullResponse,
  IUserLoginDumpedResponse,
  IUserLoginParams,
} from '../interface';
import { ERROR_CODE, Exception } from '../../global-help-utils/';
import { NotFoundX } from './../../domain-model/domain-model-exception';
import { IUser, User } from './../../domain-model/user.model';
import UseCaseBase from '../../base';
import jwtUtils from '../utils/jwt';

export default class UserLogin extends UseCaseBase<
  IUserLoginParams,
  IUserLoginFullResponse
> {
  static validationRules = {
    email: ['required', 'email', { max_length: 255 }, 'to_lc'],
    password: ['required', { min_length: 12 }],
  };

  async execute(data: IUserLoginParams): Promise<IUserLoginFullResponse> {
    const { email, password } = data;

    try {
      const user: IUser = await User.findByEmail(email);

      const isPasswordValid = await User.isPasswordValid(
        password,
        user.password,
      );

      if (!isPasswordValid) {
        throw new Exception({
          code: ERROR_CODE.AUTHENTICATION_FAILED,
          message: 'Wrong email or password',
        });
      }

      return { data: this.dumpUser(user) };
    } catch (error) {
      if (error instanceof NotFoundX) {
        throw new Exception({
          code: ERROR_CODE.AUTHENTICATION_FAILED,
          message: 'Wrong email or password',
        });
      }

      throw error;
    }
  }

  dumpUser(user: IUser): IUserLoginDumpedResponse {
    const dumpedResponse: IUserLoginDumpedResponse = {
      userId: user.id,
      username: user.username,
      email: user.email,
      accessToken: jwtUtils.generateToken({ userId: user.id }),
    };

    if (user.avatarUrlPath) dumpedResponse.avatarUrlPath = user.avatarUrlPath;

    return dumpedResponse;
  }
}

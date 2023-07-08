import { ERROR_CODE } from '../../global-help-utils/enums';
import { Exception } from '../../global-help-utils/exception';
import { IUser, User } from '../../domain-model/user.model';
import UseCaseBase from '../../base';
import {
  ISessionCheckParams,
  ISessionFullResponse,
  ISessionDumpedResponse,
} from '../interface';
import jwtUtils from '../utils/jwtUtils';
import { JwtPayload } from 'jsonwebtoken';

export class SessionCheck extends UseCaseBase<
  ISessionCheckParams,
  ISessionFullResponse
> {
  static validationRules = {
    token: ['required', 'string'],
  };
  async execute(data: ISessionCheckParams): Promise<ISessionFullResponse> {
    try {
      const userData = jwtUtils.checkToken(data.token) as JwtPayload;

      const user: IUser = await User.findById(userData?.userId);

      return { data: this.dumpTokenResponse(user) };
    } catch (error) {
      throw new Exception({
        code: ERROR_CODE.AUTHENTICATION,
        message: 'Authentication error',
      });
    }
  }

  dumpTokenResponse(user: IUser): ISessionDumpedResponse {
    const dumpedResponse: ISessionDumpedResponse = {
      email: user.email,
      username: user.username,
    };

    if (user.id) dumpedResponse.userId = user.id;
    if (user.avatarUrlPath) dumpedResponse.avatarUrlPath = user.avatarUrlPath;

    return dumpedResponse;
  }
}

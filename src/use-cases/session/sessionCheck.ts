import { ERROR_CODE } from '../../global-help-utils/enums';
import { Exception } from '../../global-help-utils/exception';
import { IUser, User } from '../../domain-model/user.model';
import UseCaseBase from '../base';
import {
  ISessionCheckParams,
  ISessionFullResponse,
  ISessionDumpedResponse,
  IUserJWTPayload,
} from '../interface';
import jwtUtils from '../utils/jwt';

export class SessionCheck extends UseCaseBase<
  ISessionCheckParams,
  ISessionFullResponse
> {
  static validationRules = {
    token: ['required', 'string'],
  };
  async execute(data: ISessionCheckParams): Promise<ISessionFullResponse> {
    try {
      const { userId } = jwtUtils.checkToken(data.token) as IUserJWTPayload;

      const user = await User.findById<IUser>(userId);

      return { data: this.dumpSessionResponse(user) };
    } catch (error) {
      throw new Exception({
        code: ERROR_CODE.AUTHENTICATION_FAILED,
        message: 'Authentication failed',
      });
    }
  }

  dumpSessionResponse(user: IUser): ISessionDumpedResponse {
    const dumpedResponse: ISessionDumpedResponse = {
      userId: user.id,
      email: user.email,
      username: user.username,
    };

    if (user.avatarUrlPath) dumpedResponse.avatarUrlPath = user.avatarUrlPath;

    return dumpedResponse;
  }
}

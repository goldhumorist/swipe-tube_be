import { User } from '../../domain-model/user.model';
import { ERROR_CODE, Exception } from '../../global-help-utils';
import jwtUtils from '../utils/jwtUtils';
import UseCaseBase from '../../base';
import { ISessionCheckParams, ISessionFullResponse } from '../interface';
import { JwtPayload } from 'jsonwebtoken';

export default class SessionCheck extends UseCaseBase<
  ISessionCheckParams,
  ISessionFullResponse
> {
  static validationRules = {
    token: ['required', 'string'],
  };
  async execute(data: ISessionCheckParams): Promise<ISessionFullResponse> {
    try {
      const formattedToken = data?.token?.replace('Bearer ', '');

      const userData = jwtUtils.checkToken(formattedToken) as JwtPayload;

      await User.findById(userData?.userId);

      return { sessionResponse: { userId: userData?.userId } };
    } catch (error) {
      throw new Exception({
        code: ERROR_CODE.AUTHENTICATION,
        message: 'Authentication error',
      });
    }
  }
}

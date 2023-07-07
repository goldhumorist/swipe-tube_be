import { User } from '../../domain-model/user.model';
import { ERROR_CODE, Exception } from '../../global-help-utils';
import jwtUtils from '../utils/jwtUtils';
import UseCaseBase from '../../base';
import { ISessionCheckParams, ISessionFullResponse } from '../interface';
import { JwtPayload } from 'jsonwebtoken';
import { NotFoundX } from '../../domain-model/domain-model-exception';

export default class SessionCheck extends UseCaseBase<
  ISessionCheckParams,
  ISessionFullResponse
> {
  static validationRules = {
    token: ['required', 'string'],
  };
  async execute(data: ISessionCheckParams): Promise<ISessionFullResponse> {
    try {
      const userData = jwtUtils.checkToken(data.token);

      await User.findById((userData as JwtPayload)?.userId);

      return { userId: (userData as JwtPayload)?.userId };
    } catch (error) {
      if (error instanceof NotFoundX) {
        throw new Exception({
          code: ERROR_CODE.WRONG_TOKEN,
          message: 'Authentication error, wrong token',
          fields: { token: 'WRONG_ID' },
        });
      }

      throw new Exception({
        code: ERROR_CODE.WRONG_TOKEN,
        message: 'Authentication error, wrong token',
        fields: { token: 'WRONG_ID' },
      });
    }
  }
}

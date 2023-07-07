import SessionCheck from '../../../../use-cases/session/sessionCheck';
import { IRequest } from '../../interfaces';
import { NextFunction, Response } from 'express';
import { chista } from '../../../utils';
import { ISessionFullResponse } from '../../../../use-cases/interface';

export default {
  checkSession: async (req: IRequest, res: Response, next: NextFunction) => {
    // Run usecase that checks, if token valid and user exists
    const sessionCheckPromise: Promise<ISessionFullResponse> =
      chista.runUseCase(SessionCheck, {
        params: { token: req.headers.authorization },
      });

    try {
      const { userId } = await sessionCheckPromise;
      req.session = {
        context: {
          userId,
        },
      };

      return next();
    } catch (error) {
      return chista.renderPromiseAsJson(req, res, sessionCheckPromise);
    }
  },
};

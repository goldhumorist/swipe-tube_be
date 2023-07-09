import { SessionCheck } from '../../../../use-cases/session/sessionCheck';
import { IRequest } from '../../interfaces';
import { NextFunction, Request, Response } from 'express';
import { chista } from '../../../utils';
import { ISessionFullResponse } from '../../../../use-cases/interface';

export default {
  checkSession: chista.makeUseCaseRunner(SessionCheck, (req: Request) => ({
    token: req.headers?.authorization?.replace('Bearer ', ''),
  })),

  checkSessionMiddleware: async (
    req: IRequest,
    res: Response,
    next: NextFunction,
  ) => {
    const token = req.headers?.authorization?.replace('Bearer ', '');

    const sessionCheckPromise: Promise<ISessionFullResponse> =
      chista.runUseCase(SessionCheck, {
        params: { token },
      });

    try {
      const { data } = await sessionCheckPromise;
      const { userId } = data;

      if (userId)
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

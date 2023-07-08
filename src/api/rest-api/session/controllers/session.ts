import { SessionCheck } from '../../../../use-cases/session/sessionCheck';
import { IRequest } from '../../interfaces';
import { NextFunction, Request, Response } from 'express';
import { chista } from '../../../utils';
import { ISessionFullResponse } from '../../../../use-cases/interface';

export default {
  checkToken: chista.makeUseCaseRunner(SessionCheck, (req: Request) => ({
    token: req.headers?.authorization?.replace('Bearer ', ''),
  })),

  checkSession: async (req: IRequest, res: Response, next: NextFunction) => {
    const reqToken = req.headers?.authorization;

    const token = reqToken?.replace('Bearer ', '');

    const sessionCheckPromise: Promise<ISessionFullResponse> =
      chista.runUseCase(SessionCheck, {
        params: { token },
      });

    try {
      const {
        data: { userId },
      } = await sessionCheckPromise;

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

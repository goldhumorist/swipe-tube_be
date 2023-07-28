import { SessionCheck } from '../../../../use-cases/session/sessionCheck';
import { IRequestWithSession } from '../../interfaces';
import { chista } from '../../../utils';
import { ISessionFullResponse } from '../../../../use-cases/interface';
import { FastifyRequest, FastifyReply } from 'fastify';

export default {
  checkSession: chista.makeUseCaseRunner(
    SessionCheck,
    (req: FastifyRequest) => ({
      token: req.headers?.authorization?.replace('Bearer ', ''),
    }),
  ),

  checkSessionMiddleware: async (req: FastifyRequest, res: FastifyReply) => {
    const token = req.headers?.authorization?.replace('Bearer ', '');

    const sessionCheckPromise: Promise<ISessionFullResponse> =
      chista.runUseCase(SessionCheck, {
        params: { token },
      });

    try {
      const { data } = await sessionCheckPromise;
      const { userId } = data;

      if (userId)
        (req as IRequestWithSession).session = {
          context: {
            userId,
          },
        };
    } catch (error) {
      await chista.renderPromiseAsJson(req, res, sessionCheckPromise);
    }
  },
};

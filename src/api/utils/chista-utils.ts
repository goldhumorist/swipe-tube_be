/* eslint-disable @typescript-eslint/typedef */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-enable @typescript-eslint/no-explicit-any */

import { Exception, ERROR_CODE } from '../../global-help-utils';
import { loggerFactory } from '../../infrastructure/logger';
import UseCaseBase from '../../use-cases/base';
import { FastifyRequest, FastifyReply } from 'fastify';
import { IRequestWithSession } from '../rest-api/interfaces';

const logger = loggerFactory.getLogger(__filename);

export async function runUseCase(
  useCaseClass: typeof UseCaseBase<any, any>,
  { context = {}, params = {} },
) {
  function logRequest(type, result, startTime) {
    return logger[type]('runUseCase', {
      useCase: useCaseClass.name,
      runtime: Date.now() - startTime,
      result,
    });
  }

  const startTime = Date.now();

  try {
    const result = await new useCaseClass({ context }).run(params);

    logRequest('info', result, startTime);

    return result;
  } catch (error: any) {
    logRequest('error', error, startTime);

    throw error;
  }
}

export function makeUseCaseRunner(
  useCaseClass: typeof UseCaseBase<any, any>,
  paramsBuilder: Function = () => {},
  contextBuilder: Function = () => {},
) {
  return async function useCaseRunner(req: FastifyRequest, res: FastifyReply) {
    const resultPromise = runUseCase(useCaseClass, {
      params: paramsBuilder(req, res),
      context: contextBuilder(req, res),
    });

    return renderPromiseAsJson(req, res, resultPromise);
  };
}

export async function renderPromiseAsJson(
  req: FastifyRequest | IRequestWithSession,
  res: FastifyReply,
  promise: Promise<any>,
) {
  try {
    const data = await promise;

    data.status = 1;

    res.send(data);
  } catch (error: any) {
    if (error instanceof Exception) {
      res.send({
        status: 0,
        error: error.toResponse(),
      });
    } else {
      logger.error('FATAL ERROR', error);

      res.send({
        status: 0,
        error: {
          code: ERROR_CODE.SERVER_ERROR,
          message: 'Something went wrong.',
        },
      });
    }
  }
}

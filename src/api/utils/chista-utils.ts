/* eslint-disable @typescript-eslint/typedef */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-enable @typescript-eslint/no-explicit-any */

import { Exception, ERROR_CODE } from '../../global-help-utils';
import { loggerFactory } from '../../infrastructure/logger';
import UseCaseBase from '../../base';
import { Request, Response } from 'express';
import { IRequest } from '../rest-api/interfaces';

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
  return async function useCaseRunner(req: Request, res: Response) {
    const resultPromise = runUseCase(useCaseClass, {
      params: paramsBuilder(req, res),
      context: contextBuilder(req, res),
    });

    return renderPromiseAsJson(req, res, resultPromise);
  };
}

export async function renderPromiseAsJson(
  req: Request | IRequest,
  res: Response,
  promise: Promise<any>,
) {
  try {
    const data = await promise;

    data.status = 1;

    return res.send(data);
  } catch (error: any) {
    if (error instanceof Exception) {
      return res.send({
        status: 0,
        error: error.toResponse(),
      });
    }

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

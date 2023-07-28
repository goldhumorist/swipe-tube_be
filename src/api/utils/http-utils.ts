/* eslint-disable */
import { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import formBody from '@fastify/formbody';
import fastifyMultipart from '@fastify/multipart';
import { FILE_SIZE_LIMIT_IN_KB } from './../../global-help-utils/enums';
import { pinoForLogger } from '../../infrastructure/logger';

export const plugins = {
  formBody: formBody,
  cors: cors,
  helmet: helmet,
  fileContentParser: fastifyMultipart,
};

export const pluginsOptions = {
  cors: { origin: '*' },
  fileContentParser: {
    attachFieldsToBody: true,
    throwFileSizeLimit: false,
    /**
     * By default, @fastify/multipart has a 1 megabyte limit for files
     * So here we must specify the maximum file size for the entire application
     * If necessary, we can change this value on each individual route
     */
    limits: { fileSize: FILE_SIZE_LIMIT_IN_KB.TWENTY_MEGABYTES },
  },
};

export const handlers = {
  preHandlerBodyLogger: (
    req: FastifyRequest,
    reply: FastifyReply,
    next: HookHandlerDoneFunction,
  ) => {
    if (req.body) {
      req.log.info({ body: req.body }, 'Request body');
    }
    next();
  },
};

export const fastifyOptions = {
  logger: pinoForLogger,
  genReqId(_req) {
    return new Date().getTime().toString();
  },
};

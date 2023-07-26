/* eslint-disable */
import { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from 'fastify';
import { pinoForLogger } from '../../infrastructure/logger';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import formBody from '@fastify/formbody';
import multer from 'fastify-multer';

export const plugins = {
  formBody: formBody,
  cors: cors,
  helmet: helmet,
  fileContentParser: multer.contentParser,
};

export const pluginsOptions = {
  cors: { origin: '*' },
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

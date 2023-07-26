import { FastifyRequest } from 'fastify';
import { File } from 'fastify-multer/lib/interfaces';

export interface IRequestWithSession extends FastifyRequest {
  session?: {
    context: {
      userId: number;
    };
  };
}

export interface IRequestWithFile extends FastifyRequest {
  file?: File;
}

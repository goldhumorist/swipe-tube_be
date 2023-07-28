import { FastifyRequest, FastifyReply } from 'fastify';
import {
  chista,
  filterFileType,
  filterFileSize,
  parseMultiFormBody,
} from '../../../utils';
import {
  AVAILABLE_IMAGE_MIMETYPES,
  ERROR_CODE,
  FILE_SIZE_LIMIT_IN_MB,
  Exception,
} from '../../../../global-help-utils';
import UserSignup from '../../../../use-cases/user/signup';
import UserLogin from '../../../../use-cases/user/login';
import { IFile } from './../../../../use-cases/interface';
import { ISignupBody } from '../../interfaces';
import { loggerFactory } from '../../../../infrastructure/logger';

const logger = loggerFactory.getLogger(__filename);

export default {
  login: chista.makeUseCaseRunner(UserLogin, (req: FastifyRequest) => req.body),

  signup: async (
    req: FastifyRequest<{ Body: ISignupBody }>,
    res: FastifyReply,
  ) => {
    try {
      const file = req.body.avatarImage;
      const fileBuffer = await file.toBuffer();

      filterFileType(file.mimetype, AVAILABLE_IMAGE_MIMETYPES);
      filterFileSize(fileBuffer, FILE_SIZE_LIMIT_IN_MB.THREE_MEGABYTES);

      const fileForUseCase: IFile = {
        buffer: fileBuffer,
        mimetype: file.mimetype,
        encoding: file.encoding,
        originalname: file.filename,
      };

      const parsedBody = parseMultiFormBody(req.body);

      const promise = chista.runUseCase(UserSignup, {
        params: {
          ...parsedBody,
          file: fileForUseCase,
        },
      });

      await chista.renderPromiseAsJson(req, res, promise);
    } catch (error: any) {
      logger.error('SIGN UP ERROR', error);

      const errorResponse = {
        status: 0,
        error: {
          code: ERROR_CODE.SERVER_ERROR,
          message: error.message || error.code,
        },
      };

      if (error instanceof Exception) errorResponse.error = error.toResponse();

      res.send(errorResponse);
    }
  },
};

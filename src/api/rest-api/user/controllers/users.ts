import { filterFileType } from './../../../utils';
import {
  AVAILABLE_IMAGE_MIMETYPES,
  ERROR_CODE,
  FILE_SIZE_LIMIT,
} from '../../../../global-help-utils/enums';
import { loggerFactory } from '../../../../infrastructure/logger';
import multer, { MulterError } from 'fastify-multer';
import { chista } from '../../../utils';
import UserSignup from '../../../../use-cases/user/signup';
import UserLogin from '../../../../use-cases/user/login';
import { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';
import { IRequestWithFile } from '../../interfaces';

const logger = loggerFactory.getLogger(__filename);

const upload = multer({
  limits: { fileSize: FILE_SIZE_LIMIT.THREE_MEGABYTES },
  fileFilter: filterFileType(AVAILABLE_IMAGE_MIMETYPES),
});

export default {
  login: chista.makeUseCaseRunner(UserLogin, (req: FastifyRequest) => req.body),

  signup: async (req: FastifyRequest, res: FastifyReply): Promise<any> => {
    try {
      await new Promise<void>((resolve, reject) => {
        upload.single('avatarImage').bind(this as unknown as FastifyInstance)(
          req,
          res,
          err => (err ? reject(err) : resolve()),
        );
      });

      const { file } = req as IRequestWithFile;

      const promise = chista.runUseCase(UserSignup, {
        params: {
          ...(req.body || {}),
          file,
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

      if (error instanceof MulterError)
        errorResponse.error.code = ERROR_CODE.BAD_REQUEST;

      res.send(errorResponse);
    }
  },
};

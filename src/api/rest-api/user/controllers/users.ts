import { ERROR_CODE } from '../../../../global-help-utils/enums';
import { Request, Response } from 'express';
import { loggerFactory } from '../../../../infrastructure/logger';
import multer from 'multer';
import { chista } from '../../utils';
import UserSignup from '../../../../use-cases/user/signup';
import UserLogin from '../../../../use-cases/user/login';

const logger = loggerFactory.getLogger(__filename);
const upload = multer({ limits: { fileSize: 3000000 } });

export default {
  signup: async (req: Request, res: Response) => {
    try {
      await new Promise<void>((resolve, reject) => {
        upload.single('avatarImage')(req, res, err =>
          err ? reject(err) : resolve(),
        );
      });

      const { file } = req;

      const promise = chista.runUseCase(UserSignup, {
        params: {
          ...req.body,
          file,
          mimetype: file?.mimetype,
        },
      });

      chista.renderPromiseAsJson(req, res, promise);
    } catch (error: any) {
      logger.error('SIGN UP ERROR', error);

      const errorResponse = {
        status: 0,
        error: {
          code: ERROR_CODE.SERVER_ERROR,
          message: error.message,
        },
      };

      if (error instanceof multer.MulterError)
        errorResponse.error.code = ERROR_CODE.BAD_REQUEST;

      res.send(errorResponse);
    }
  },
  login: chista.makeUseCaseRunner(UserLogin, (req: Request) => req.body),
};

import { MulterError } from 'fastify-multer';
import { ERROR_CODE } from '../../global-help-utils/enums';
import { File } from 'fastify-multer/lib/interfaces';
import { ErrorMessages } from 'fastify-multer/lib/lib/multer-error';

export const filterFileType = (availableFileMimeTypes: Array<string>) => {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return (_, file: File, callback: Function) => {
    if (availableFileMimeTypes.includes(file.mimetype))
      return callback(null, true);

    return callback(
      new MulterError(
        ERROR_CODE.FILE_IS_NOT_ALLOWED as any as keyof ErrorMessages,
      ),
    );
  };
};

import path from 'path';
import { ErrorCode, MulterError } from 'multer';
import { Express } from 'express';
import { ERROR_CODE } from '../../global-help-utils/enums';

export const filterFileType = (availibleFileTypes: Array<string>) => {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return (_, file: Express.Multer.File, callback: Function) => {
    const fileExtention = path.extname(file.originalname)?.toLowerCase();

    if (availibleFileTypes.includes(fileExtention)) return callback(null, true);

    return callback(
      new MulterError(ERROR_CODE.FILE_IS_NOT_ALLOWED as unknown as ErrorCode),
    );
  };
};

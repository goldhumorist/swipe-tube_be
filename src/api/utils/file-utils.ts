import { Exception } from '../../global-help-utils/exception';
import { ERROR_CODE } from '../../global-help-utils/enums';

export const filterFileType = (
  mimeType: string,
  availableFileMimeTypes: Array<string>,
) => {
  if (!availableFileMimeTypes.includes(mimeType)) {
    throw new Exception({
      code: ERROR_CODE.FILE_IS_NOT_ALLOWED,
      message: 'File must be an image',
    });
  }
};

export const filterFileSize = (fileBuffer: Buffer, maxFileSize: number) => {
  const fileSizeInMegabytes = fileBuffer.byteLength / (1024 * 1024);

  if (fileSizeInMegabytes > maxFileSize) {
    throw new Exception({
      code: ERROR_CODE.FILE_IS_NOT_ALLOWED,
      message: 'File is too large',
    });
  }
};

export const parseMultiFormBody = (body: object) => {
  const parsedBody = Object.fromEntries(
    Object.keys(body).map(key => [key, body[key].value]),
  );

  return parsedBody;
};

import { ERROR_CODE } from './enums';

export interface IExceptionData {
  code: ERROR_CODE;
  message: string;
  fields?: object;
}

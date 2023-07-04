import { ERROR_CODE } from './enums';
import { IExceptionData } from './interfaces';

export class Exception extends Error {
  code: ERROR_CODE;
  message: string;
  fields?: object;

  constructor(data: IExceptionData) {
    super();
    if (!data.message) throw new Error('MESSAGE_REQUIRED');
    if (!data.code) throw new Error('CODE_REQUIRED');

    this.code = data.code;
    this.message = data.message;
    this.fields = data.fields;
  }

  toResponse() {
    const response: IExceptionData = {
      code: this.code,
      message: this.message,
    };

    if (this.fields) response.fields = this.fields;

    return response;
  }
}

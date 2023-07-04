import { IDMExceptionData } from './interfaces';

export class BaseError extends Error {
  message: string;
  field: string;
  parent: Error;

  constructor(data: IDMExceptionData) {
    super();

    if (!data.message) throw new Error('MESSAGE_REQUIRED');
    if (!data.field) throw new Error('FIELD_REQUIRED');

    this.message = data.message;
    this.field = data.field;
    this.parent = data.parent;
  }
}

export class NotUniqueX extends BaseError {}
export class WrongParameterValueX extends BaseError {}

export default {
  BaseError,
  NotUniqueX,
  WrongParameterValueX,
};

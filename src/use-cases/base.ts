import { Exception, ERROR_CODE } from '../global-help-utils';
import LIVR from 'livr';

LIVR.Validator.defaultAutoTrim(true);

export default class UseCaseBase<T, K> {
  static validationRules: object | null = null;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(...args) {}

  /**
   *  This method start all chains of methods
   *  sanitize, validate, execute... etc.
   *  Should not be overridden.
   *
   */
  async run(params: T): Promise<K> {
    return this.validate(params).then((cleanParams: T) =>
      this.execute(cleanParams),
    );
  }

  /**
   *  This method runs validation.
   *  Should not be overridden,
   *  otherwise use-case class should contain static field 'validationRules'
   */
  async validate(data: T): Promise<T> {
    const { validationRules } = this.constructor as typeof UseCaseBase;
    if (!validationRules)
      throw new Error('ValidationRules should be specified');

    const livrValidator = new LIVR.Validator(validationRules);

    const validData = livrValidator.validate(data);

    if (validData) return validData;

    throw new Exception({
      code: ERROR_CODE.BAD_REQUEST,
      message: 'FORMAT_ERROR',
      fields: livrValidator.getErrors(),
    });
  }

  /**
   *  Main method of use-case class
   *  Contains the main logic
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async execute(data: T): Promise<K> {
    throw new Error('METHOD IS NOT IMPLEMENTED IN BASE CLASS');
  }
}

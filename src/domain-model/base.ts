import { NotUniqueX } from './domain-model-exception';
import { UniqueConstraintError } from 'sequelize';
import { Model } from 'sequelize-typescript';

/**
 * Base class of all models
 * Here you can add global methonds, settings, etc
 */
export class Base<T extends object> extends Model<T> {
  async save(...args) {
    try {
      return await super.save(...args);
    } catch (x) {
      if (x instanceof UniqueConstraintError) {
        const error = x.errors[0];

        throw new NotUniqueX({
          message: error.message,
          field: error?.path || '',
          parent: x,
        });
      }

      throw x;
    }
  }
}

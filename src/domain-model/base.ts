import { NotFoundX, NotUniqueX } from './domain-model-exception';
import { DestroyOptions, UniqueConstraintError, WhereOptions } from 'sequelize';
import { Model } from 'sequelize-typescript';

/**
 * Base class of all models
 * Here you can add global methonds, settings, etc
 */
export class Base<T extends object> extends Model<T> {
  static async findById<T>(id: number): Promise<T> {
    const entity = await super.findOne({
      where: { id } as WhereOptions,
    });

    if (!entity) {
      throw new NotFoundX({
        message: `There is no ${this.name} with id = "${id}"`,
        field: 'id',
      });
    }

    return entity as T;
  }

  async destroyById<T>(id: number): Promise<T> {
    return super.destroy({
      where: { id } as WhereOptions,
    } as DestroyOptions) as T;
  }

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

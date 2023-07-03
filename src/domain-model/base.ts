import { Model } from 'sequelize-typescript';

/**
 * Base class of all models
 * Here you can add global methonds, settings, etc
 */
export class Base<T extends object> extends Model<T> {}

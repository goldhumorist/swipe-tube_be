import { PASSWORD_HASH_SALT_ROUNDS } from '../global-help-utils/enums';
import { config } from '../config';
import {
  Table,
  Column,
  DataType,
  PrimaryKey,
  AllowNull,
  AutoIncrement,
  Unique,
  Default,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import { Base } from './base';
import bcrypt from 'bcrypt';

export interface IUser {
  id?: number;
  username: string;
  email: string;
  password: string;
  avatarUrlPath: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

@Table({
  tableName: 'users',
  schema: config.database.schema,
  timestamps: false,
})
export class User extends Base<IUser> {
  @PrimaryKey
  @AllowNull(false)
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Unique
  @AllowNull(false)
  @Column(DataType.STRING)
  username: string;

  @Unique
  @AllowNull(false)
  @Column(DataType.STRING)
  email: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  password: string;

  @AllowNull(true)
  @Column({ type: DataType.STRING, field: 'avatar_url_path' })
  avatarUrlPath: string | null;

  @AllowNull(false)
  @Default(DataType.NOW())
  @Column({ type: DataType.DATE, field: 'created_at' })
  @CreatedAt
  createdAt: Date;

  @AllowNull(false)
  @Default(DataType.NOW())
  @Column({ type: DataType.DATE, field: 'updated_at' })
  @UpdatedAt
  updatedAt: Date;

  async destroyById(id: number) {
    return User.destroy({ where: { id } });
  }

  static async _hashPassword(plainPassword) {
    return bcrypt.hash(plainPassword, PASSWORD_HASH_SALT_ROUNDS);
  }
}

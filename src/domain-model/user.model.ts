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
  BeforeCreate,
} from 'sequelize-typescript';
import { Base } from './base';
import bcrypt from 'bcrypt';
import { NotFoundX } from './domain-model-exception';

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

  @BeforeCreate
  static async hashPassword(instance: User): Promise<void> {
    instance.password = await User._hashPassword(instance.password);
  }

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

  static async findByEmail(email: string) {
    const user: IUser | null = await User.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundX({
        message: 'USER_NOT_FOUND',
        field: 'email',
      });
    }

    return user;
  }

  async destroyById(id: number) {
    return User.destroy({ where: { id } });
  }

  static async _hashPassword(plainPassword: string) {
    return bcrypt.hash(plainPassword, PASSWORD_HASH_SALT_ROUNDS);
  }

  static async isPasswordValid(password: string, encryptedPassword: string) {
    return bcrypt.compare(password, encryptedPassword);
  }
}

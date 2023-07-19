import { User } from './user.model';
import { config } from '../config';
import {
  Table,
  Column,
  DataType,
  AllowNull,
  Default,
  CreatedAt,
  UpdatedAt,
  ForeignKey,
} from 'sequelize-typescript';
import { Base } from './base';
import { Video } from './video.model';
import { NotUniqueX } from './domain-model-exception';
import { Transaction } from 'sequelize';

export interface IVideoViews {
  authorId: number;
  videoId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

@Table({
  tableName: 'video-views',
  schema: config.database.schema,
  timestamps: false,
})
export class VideoViews extends Base<IVideoViews> {
  @ForeignKey(() => User)
  @AllowNull(false)
  @Column({ type: DataType.INTEGER, field: 'author_id' })
  authorId: number;

  @ForeignKey(() => Video)
  @AllowNull(false)
  @Column({ type: DataType.INTEGER, field: 'video_id' })
  videoId: number;

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

  static async addViewForVideo(
    data: {
      authorId: number;
      videoId: number;
    },
    transaction?: Transaction,
  ): Promise<IVideoViews> {
    const { authorId, videoId } = data;

    const [videoViews, isCreated] = await VideoViews.findOrCreate({
      where: { authorId, videoId },
      defaults: { authorId, videoId },
      transaction,
    });

    if (!isCreated) {
      throw new NotUniqueX({
        message: `User - ${authorId} has already viewed video - ${videoId}`,
        field: 'AuthorId',
      });
    }

    return videoViews;
  }
}

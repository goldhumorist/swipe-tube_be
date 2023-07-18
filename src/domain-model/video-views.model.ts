import { User } from './user.model';
import { config } from '../config';
import {
  Table,
  Column,
  DataType,
  PrimaryKey,
  AllowNull,
  AutoIncrement,
  Default,
  CreatedAt,
  UpdatedAt,
  ForeignKey,
  HasMany,
} from 'sequelize-typescript';
import { Base } from './base';
import { Video } from './video.model';

export interface IVideoViews {
  id?: number;
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
  @PrimaryKey
  @AllowNull(false)
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

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

  static async countViews(videoId: number) {
    const views = await VideoViews.count({
      where: { videoId },
    });
    return { views };
  }
}

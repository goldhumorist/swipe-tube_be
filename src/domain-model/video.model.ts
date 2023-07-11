import { User } from './user.model';
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
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Base } from './base';
import { IListMyVideosData, IMyVideosResponse } from './interfaces';

export interface IVideo {
  id?: number;
  authorId: number;
  description?: string | null;
  videoUrlPath: string;
  thumbnailUrlPath: string;
  createdAt?: Date;
  updatedAt?: Date;
}

@Table({
  tableName: 'videos',
  schema: config.database.schema,
  timestamps: false,
})
export class Video extends Base<IVideo> {
  @PrimaryKey
  @AllowNull(false)
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column({ type: DataType.INTEGER, field: 'author_id' })
  authorId: number;

  @BelongsTo(() => User)
  author: User;

  @Unique
  @AllowNull(true)
  @Column(DataType.STRING)
  description: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING, field: 'video_url_path' })
  videoUrlPath: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING, field: 'thumbnail_url_path' })
  thumbnailUrlPath: string;

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

  static async listMyVideos(
    data: IListMyVideosData,
  ): Promise<IMyVideosResponse> {
    const { userId, page, limit } = data;

    const offset = limit * page - limit;

    const videos = await Video.findAndCountAll({
      where: { authorId: userId },
      limit,
      offset,
    });

    return {
      videos: videos.rows,
      pagination: {
        page,
        pageSize: videos.rows.length,
        totalRows: videos.count,
      },
    };
  }
}
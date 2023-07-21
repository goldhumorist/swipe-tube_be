import { VideoReactionsEnum } from './video-reactions.model';
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
  BelongsToMany,
  HasOne,
} from 'sequelize-typescript';
import { Base } from './base';
import {
  IListMyVideosData,
  IMyVideosResponse,
  ISwipeVideoQueryResponse,
  ISwipeVideosData,
  ISwipeVideosResponse,
  IVideoMetaRecordResponse,
} from './interfaces';
import { Op } from 'sequelize';
import { VideoViews } from './video-views.model';
import { VideoStatistic } from './video-statistic.model';
import { VideoReactions } from './video-reactions.model';

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

  @BelongsToMany(() => User, () => VideoViews)
  userViews: Array<User & { VideoViews: VideoViews }>;

  @HasOne(() => VideoStatistic)
  videoStatistic: VideoStatistic;

  @BelongsToMany(() => User, () => VideoReactions)
  userVideoReactions: Array<User & { VideoReactions: VideoReactions }>;

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
      order: [['createdAt', 'DESC']],
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

  static async listVideosForSwipe(
    data: ISwipeVideosData,
  ): Promise<ISwipeVideosResponse> {
    const { userId, page, mainLimit, itemLimit } = data;

    const offset = mainLimit * page - mainLimit;

    const videos = (await Video.findAndCountAll({
      where: { authorId: { [Op.not]: userId } },
      include: [
        {
          model: VideoStatistic,
          attributes: { exclude: ['id', 'videoId', 'createdAt', 'updatedAt'] },
        },
        {
          model: User,
          as: 'userViews',
          attributes: ['id'],
          where: { id: userId },
          required: false,
        },
        {
          model: User,
          as: 'userVideoReactions',
          attributes: ['id'],
          where: { id: userId },
          required: false,
        },
      ],
      limit: itemLimit,
      offset,
    })) as unknown as ISwipeVideoQueryResponse;

    const videoResult = videos.rows.map(video => {
      return {
        ...video.dataValues,
        metaData: {
          isViewed: video.userViews.length > 0,
          isLiked:
            video.userVideoReactions[0]?.VideoReactions?.reactionTitle ===
            VideoReactionsEnum.like,
          isDisliked:
            video.userVideoReactions[0]?.VideoReactions?.reactionTitle ===
            VideoReactionsEnum.dislike,
        },
      };
    }) as Array<IVideoMetaRecordResponse>;

    return {
      videos: videoResult,
      pagination: {
        page,
        pageSize: videos.rows.length,
        totalRows: videos.count,
      },
    };
  }
}

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
  BelongsTo,
} from 'sequelize-typescript';
import { Base } from './base';
import { Video } from './video.model';
import { Sequelize, Transaction } from 'sequelize';
import { IUpdateVideoLikesParams, VideoLikesActionEnum } from './interfaces';
import { Literal } from 'sequelize/types/utils';

export interface IVideoStatistic {
  id?: number;
  videoId: number;
  viewsAmount?: number;
  likesAmount?: number;
  dislikesAmount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

@Table({
  tableName: 'video-statistic',
  schema: config.database.schema,
  timestamps: false,
})
export class VideoStatistic extends Base<IVideoStatistic> {
  @PrimaryKey
  @AllowNull(false)
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @ForeignKey(() => Video)
  @AllowNull(false)
  @Column({ type: DataType.INTEGER, field: 'video_id' })
  videoId: number;

  @AllowNull(false)
  @Default(0)
  @Column({ type: DataType.INTEGER, field: 'likes_amount' })
  likesAmount: number;

  @AllowNull(false)
  @Default(0)
  @Column({ type: DataType.INTEGER, field: 'dislikes_amount' })
  dislikesAmount: number;

  @AllowNull(false)
  @Default(0)
  @Column({ type: DataType.INTEGER, field: 'views_amount' })
  viewsAmount: number;

  @BelongsTo(() => Video)
  video: Video;

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

  static async incrementVideoViews(
    videoId: number,
    transaction?: Transaction,
  ): Promise<number> {
    const [_, [updatedRow]] = await VideoStatistic.update(
      { viewsAmount: Sequelize.literal(`views_amount + 1`) },
      {
        where: { videoId },
        returning: true,
        transaction,
      },
    );

    return updatedRow.viewsAmount;
  }

  static async updateVideoLikes(
    params: IUpdateVideoLikesParams,
    videoId: number,
    transaction?: Transaction,
  ): Promise<IVideoStatistic> {
    const { like, dislike } = params;

    const updateParams: {
      likesAmount?: Literal;
      dislikesAmount?: Literal;
    } = {};

    if (like) {
      updateParams.likesAmount =
        like === VideoLikesActionEnum.increase
          ? Sequelize.literal(`likes_amount + 1`)
          : Sequelize.literal(
              'CASE WHEN likes_amount > 0 THEN likes_amount - 1 ELSE 0 END',
            );
    }

    if (dislike) {
      updateParams.dislikesAmount =
        dislike === VideoLikesActionEnum.increase
          ? Sequelize.literal(`dislikes_amount + 1`)
          : Sequelize.literal(
              'CASE WHEN dislikes_amount > 0 THEN dislikes_amount - 1 ELSE 0 END',
            );
    }

    const [_, [updatedRow]] = await VideoStatistic.update(updateParams, {
      where: { videoId },
      returning: true,
      transaction,
    });

    return updatedRow as IVideoStatistic;
  }
}

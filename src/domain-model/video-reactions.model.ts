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
import { Sequelize, Transaction } from 'sequelize';
import {
  IUpdateVideoReactionDMResponse,
  IUpdateVideoReactionData,
} from './interfaces';

export enum VideoReactionsEnum {
  like = 'LIKE',
  dislike = 'DISLIKE',
}

export interface IVideoReactions {
  userId: number;
  videoId: number;
  reactionTitle: 'LIKE' | 'DISLIKE';
  createdAt?: Date;
  updatedAt?: Date;
}

@Table({
  tableName: 'video-reactions',
  schema: config.database.schema,
  timestamps: false,
})
export class VideoReactions extends Base<IVideoReactions> {
  @ForeignKey(() => User)
  @AllowNull(false)
  @Column({ type: DataType.INTEGER, field: 'user_id' })
  userId: number;

  @ForeignKey(() => Video)
  @AllowNull(false)
  @Column({ type: DataType.INTEGER, field: 'video_id' })
  videoId: number;

  @AllowNull(true)
  @Column({ type: DataType.ENUM('LIKE', 'DISLIKE'), field: 'reaction_title' })
  reactionTitle: string;

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

  static async updateVideoReaction(
    data: IUpdateVideoReactionData,
    transaction?: Transaction,
  ): Promise<IUpdateVideoReactionDMResponse> {
    const { videoId, reactionTitle, userId } = data;

    const videoReactionRow = await VideoReactions.findOne({
      where: { userId, videoId },
      transaction,
    });

    if (videoReactionRow) {
      const [_, [updatedRow]] = await VideoReactions.update(
        { reactionTitle },
        {
          where: { userId, videoId },
          returning: true,
          transaction,
        },
      );
      return {
        isVideoUpdated: videoReactionRow.reactionTitle !== reactionTitle,
        newReactionTitle: updatedRow.reactionTitle as VideoReactionsEnum,
      };
    }

    const videoReaction = await VideoReactions.create({
      userId,
      videoId,
      reactionTitle,
    });

    return {
      isVideoUpdated: true,
      newReactionTitle: videoReaction.reactionTitle as VideoReactionsEnum,
    };
  }
}

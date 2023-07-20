import { VideoLikesActionEnum } from './../../domain-model/interfaces';
import {
  IVideoStatistic,
  VideoStatistic,
} from './../../domain-model/video-statistic.model';
import { Database } from './../../domain-model/index';
import {
  VideoReactions,
  VideoReactionsEnum,
} from './../../domain-model/video-reactions.model';
import { loggerFactory } from '../../infrastructure/logger';
import {
  IUpdateVideoReactionDataToDump,
  IUpdateVideoReactionDumped,
  IUpdateVideoReactionFullResponse,
  IUpdateVideoReactionParams,
} from '../interface';
import UseCaseBase from '../base';

const logger = loggerFactory.getLogger(__filename);

export default class UpdateVideoReaction extends UseCaseBase<
  IUpdateVideoReactionParams,
  IUpdateVideoReactionFullResponse
> {
  static validationRules = {
    userId: ['required'],
    videoId: ['required'],
    reaction: ['required', 'to_uc', { one_of: ['LIKE', 'DISLIKE'] }],
  };

  async execute(
    data: IUpdateVideoReactionParams,
  ): Promise<IUpdateVideoReactionFullResponse> {
    const transaction = await Database.getInstance().transaction();

    try {
      const { userId, videoId, reaction } = data;

      const { isVideoUpdated, newReactionTitle } =
        await VideoReactions.updateVideoReaction(
          {
            reactionTitle: reaction,
            userId,
            videoId,
          },
          transaction,
        );

      if (!isVideoUpdated) {
        const videoStatistic = (await VideoStatistic.findOne({
          where: { videoId },
          transaction,
        })) as IVideoStatistic;

        await transaction.commit();

        return {
          data: this.dumpResult({
            userId,
            videoId,
            videoStatistic,
          }),
        };
      }

      let updatedVideoStatistic: IVideoStatistic;

      if (newReactionTitle === VideoReactionsEnum.like) {
        updatedVideoStatistic = await VideoStatistic.updateVideoLikes(
          {
            like: VideoLikesActionEnum.increase,
            dislike: VideoLikesActionEnum.descrease,
          },
          videoId,
          transaction,
        );
      } else {
        updatedVideoStatistic = await VideoStatistic.updateVideoLikes(
          {
            like: VideoLikesActionEnum.descrease,
            dislike: VideoLikesActionEnum.increase,
          },
          videoId,
          transaction,
        );
      }

      await transaction.commit();

      return {
        data: this.dumpResult({
          userId,
          videoId,
          videoStatistic: updatedVideoStatistic,
        }),
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  dumpResult(data: IUpdateVideoReactionDataToDump): IUpdateVideoReactionDumped {
    const { userId, videoId, videoStatistic } = data;

    return {
      userId,
      videoId,
      likes: videoStatistic.likesAmount,
      dislikes: videoStatistic.dislikesAmount,
    };
  }
}

import {
  IUpdateVideoLikesParams,
  VideoLikesActionEnum,
} from './../../domain-model/interfaces';
import { VideoStatistic } from './../../domain-model/video-statistic.model';
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

      const reactionUpdatingResult = await VideoReactions.updateVideoReaction(
        {
          reactionTitle: reaction,
          userId,
          videoId,
        },
        transaction,
      );

      const updateStatsParams: IUpdateVideoLikesParams = {};

      // The user has canceled his reaction
      if (reactionUpdatingResult.newReactionTitle === null) {
        // After user has canceled reaction we should decrease statistic
        if (
          reactionUpdatingResult.previousReactionTitle ===
          VideoReactionsEnum.like
        )
          updateStatsParams.like = VideoLikesActionEnum.descrease;

        // After user has canceled reaction we should decrease statistic
        if (
          reactionUpdatingResult.previousReactionTitle ===
          VideoReactionsEnum.dislike
        )
          updateStatsParams.dislike = VideoLikesActionEnum.descrease;
      } else {
        // User has changed reaction dislike -> like
        if (
          reactionUpdatingResult.newReactionTitle === VideoReactionsEnum.like
        ) {
          updateStatsParams.like = VideoLikesActionEnum.increase;
          updateStatsParams.dislike = VideoLikesActionEnum.descrease;
        }

        // User has changed reaction like -> dislike
        if (
          reactionUpdatingResult.newReactionTitle === VideoReactionsEnum.dislike
        ) {
          updateStatsParams.like = VideoLikesActionEnum.descrease;
          updateStatsParams.dislike = VideoLikesActionEnum.increase;
        }
      }

      const updatedVideoStatistic = await VideoStatistic.updateVideoLikes(
        updateStatsParams,
        videoId,
        transaction,
      );

      const updatedVideoMeta = {
        isLiked:
          reactionUpdatingResult.newReactionTitle === VideoReactionsEnum.like,
        isDisliked:
          reactionUpdatingResult.newReactionTitle ===
          VideoReactionsEnum.dislike,
      };

      await transaction.commit();

      return {
        data: this.dumpResult({
          userId,
          videoId,
          videoStatistic: updatedVideoStatistic,
          videoMeta: updatedVideoMeta,
        }),
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  dumpResult(data: IUpdateVideoReactionDataToDump): IUpdateVideoReactionDumped {
    const { userId, videoId, videoStatistic, videoMeta } = data;

    return {
      userId,
      videoId,
      statistic: {
        likes: videoStatistic.likesAmount,
        dislikes: videoStatistic.dislikesAmount,
      },
      metaData: {
        isLiked: videoMeta.isLiked,
        isDisliked: videoMeta.isDisliked,
      },
    };
  }
}

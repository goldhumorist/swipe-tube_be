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

      let updateStatsParams: IUpdateVideoLikesParams = {};

      const { newReactionTitle, previousReactionTitle } =
        reactionUpdatingResult;

      if (this.isUserCanceledReaction(newReactionTitle)) {
        updateStatsParams = this.getParamsForStatsAfterCancelingReaction(
          previousReactionTitle,
        );
      } else {
        updateStatsParams =
          this.getParamsForStatsAfterChangingReaction(newReactionTitle);
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

  isUserCanceledReaction(newReaction: VideoReactionsEnum | null) {
    return newReaction === null;
  }

  getParamsForStatsAfterCancelingReaction(
    previousReaction: VideoReactionsEnum | null,
  ): IUpdateVideoLikesParams {
    const params: IUpdateVideoLikesParams = {};

    if (previousReaction === VideoReactionsEnum.like)
      params.like = VideoLikesActionEnum.descrease;

    if (previousReaction === VideoReactionsEnum.dislike)
      params.dislike = VideoLikesActionEnum.descrease;

    return params;
  }

  getParamsForStatsAfterChangingReaction(
    newReaction: VideoReactionsEnum | null,
  ): IUpdateVideoLikesParams {
    const params: IUpdateVideoLikesParams = {};

    if (newReaction === VideoReactionsEnum.like) {
      params.like = VideoLikesActionEnum.increase;
      params.dislike = VideoLikesActionEnum.descrease;
    }

    if (newReaction === VideoReactionsEnum.dislike) {
      params.like = VideoLikesActionEnum.descrease;
      params.dislike = VideoLikesActionEnum.increase;
    }

    return params;
  }
}

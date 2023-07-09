import { IListVideosParams, IListVideosResponse } from '../interface';
import UseCaseBase from '../../base';

export default class ListVideos extends UseCaseBase<
  IListVideosParams,
  IListVideosResponse
> {
  static validationRules = {};
  async execute(data: IListVideosParams): Promise<IListVideosResponse> {
    return { mock: 'mock' };
  }
}

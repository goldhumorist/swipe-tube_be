import ListVideos from '../../../../use-cases/video/list';
import { chista } from '../../../utils';
import { Request } from 'express';

export default {
  list: chista.makeUseCaseRunner(ListVideos, (req: Request) => req.body),
};

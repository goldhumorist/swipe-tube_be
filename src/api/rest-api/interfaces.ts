import { Request } from 'express';

export interface IRequest extends Request {
  session?: {
    context: {
      userId: number;
    };
  };
}

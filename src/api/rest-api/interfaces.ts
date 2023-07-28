import { MultipartFile } from '@fastify/multipart';
import { FastifyRequest } from 'fastify';

export interface IRequestWithSession extends FastifyRequest {
  session?: {
    context: {
      userId: number;
    };
  };
}

export interface ISignupBody {
  avatarImage: MultipartFile;
  email: string;
  username: string;
  password: string;
}

export interface IUploadVideoBody {
  video: MultipartFile;
}

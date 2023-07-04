import { config } from './../config';
import {
  PutObjectCommand,
  PutObjectCommandOutput,
  S3,
} from '@aws-sdk/client-s3';
import { IUploadFileData } from './interfaces';

const { accessKeyId, secretAccessKey, bucket, bucketRegion } = config.S3;

export class AWS_S3 {
  private S3Instance: S3;

  constructor() {
    if (!this.S3Instance) {
      this.S3Instance = new S3({
        region: bucketRegion,
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
      });
    }
  }

  async uploadFileToS3(data: IUploadFileData): Promise<PutObjectCommandOutput> {
    const { body, key, contentType } = data;

    const uploadObjectCommand = new PutObjectCommand({
      Bucket: bucket,
      Body: body,
      Key: key,
      ContentType: contentType,
    });

    const result = await this.S3Instance.send(uploadObjectCommand);

    return result;
  }
}

export const S3Client = new AWS_S3();

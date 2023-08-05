import { loggerFactory } from '../../infrastructure/logger';
import installerFfmpeg from '@ffmpeg-installer/ffmpeg';
import ffmpeg from 'fluent-ffmpeg';
import stream, { Readable } from 'stream';

const logger = loggerFactory.getLogger(__filename);

const ffmpegPath = installerFfmpeg.path;

export default class VideoService {
  private ffmpegInstance: ffmpeg.FfmpegCommand;

  private thumbnailConfig = {
    inputFormat: 'mp4',
    frames: 1,
    outputFormat: 'image2pipe',
    outputOptions: ['-ss', '00:00:05', '-vf', 'scale=1080:1920'],
  };
  constructor() {
    if (!this.ffmpegInstance) {
      ffmpeg.setFfmpegPath(ffmpegPath);
      this.ffmpegInstance = ffmpeg();
    }
  }

  async createThumbnailForVideo(videoBuffer: Buffer): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
      const videoStream = new Readable();
      videoStream.push(videoBuffer);
      videoStream.push(null);

      let thumbnailBuffer = Buffer.alloc(0);
      const thumbnailChunks: Buffer[] = [];

      const thumbnailStream = new stream.PassThrough();

      ffmpeg(videoStream)
        .inputFormat(this.thumbnailConfig.inputFormat)
        .frames(this.thumbnailConfig.frames)
        .outputFormat(this.thumbnailConfig.outputFormat)
        .outputOptions(...this.thumbnailConfig.outputOptions)
        .on('error', error => {
          reject(error);
        })
        .pipe(thumbnailStream);

      thumbnailStream.on('data', chunk => {
        thumbnailChunks.push(chunk);
      });

      thumbnailStream.on('end', () => {
        thumbnailBuffer = Buffer.concat(thumbnailChunks);
        resolve(thumbnailBuffer);
      });

      thumbnailStream.on('error', error => {
        reject(error);
      });
    });
  }
}

export const videoService = new VideoService();

import { loggerFactory } from '../../infrastructure/logger';
import fs from 'fs/promises';
import installerFfmpeg from '@ffmpeg-installer/ffmpeg';
import installerFfprobe from '@ffprobe-installer/ffprobe';
import ffmpeg from 'fluent-ffmpeg';
import path from 'path';

const logger = loggerFactory.getLogger(__filename);

const ffmpegPath = installerFfmpeg.path;
const ffprobePath = installerFfprobe.path;

export default class VideoService {
  private ffmpegInstance: ffmpeg.FfmpegCommand;
  private tempFilesDirectory = path.resolve(
    __dirname,
    '../../../',
    'temp-files',
  );
  private thumbnailConfig = {
    timingForThumbnail: '00:00:05',
    size: '1080x1920',
    frames: 1,
  };

  constructor() {
    if (!this.ffmpegInstance) {
      ffmpeg.setFfprobePath(ffprobePath);
      ffmpeg.setFfmpegPath(ffmpegPath);

      this.ffmpegInstance = ffmpeg();
    }
  }

  async createThumbnailForVideo(
    videoBuffer: Buffer,
    options: { videoFileName: string; thumbnailFileName: string },
  ) {
    const { videoFileName, thumbnailFileName } = options;

    const videoFilePath = `${this.tempFilesDirectory}/${videoFileName}`;
    const thumbnailFilePath = `${this.tempFilesDirectory}/${thumbnailFileName}`;

    await fs.writeFile(videoFilePath, videoBuffer);

    let thumbnailBuffer: Buffer | undefined;

    await new Promise<void>((resolve, reject) => {
      ffmpeg()
        .input(videoFilePath)
        .output(thumbnailFilePath)
        .seekInput(this.thumbnailConfig.timingForThumbnail)
        .size(this.thumbnailConfig.size)
        .frames(this.thumbnailConfig.frames)
        .on('end', () => resolve())
        .on('error', error => reject(error))
        .run();
    }).finally(async () => {
      thumbnailBuffer = await fs.readFile(thumbnailFilePath);

      await this.removeFile(videoFilePath);
      await this.removeFile(thumbnailFilePath);
    });

    return thumbnailBuffer as Buffer;
  }

  async removeAllTempFiles() {
    const files = (await fs.readdir(this.tempFilesDirectory)).filter(
      file => file !== '.gitkeep',
    );

    await Promise.all(
      files.map(async file => {
        const filePath = path.join(this.tempFilesDirectory, file);
        await this.removeFile(filePath);
      }),
    );
  }

  private removeFile = async (path: string) => {
    try {
      await fs.unlink(path);
    } catch (error) {
      logger.error('Error during deleting file', error);
    }
  };
}

export const videoService = new VideoService();

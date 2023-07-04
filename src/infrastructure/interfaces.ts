import internal from 'stream';

export interface IUploadFileData {
  body:
    | string
    | internal.Readable
    | ReadableStream
    | Blob
    | Uint8Array
    | Buffer;
  key: string;
  contentType?: string;
}

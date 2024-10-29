import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import { FILE_TYPE } from '../user/dto/car.dto';

@Injectable()
export class CloudinaryService {
  private readonly logger = new Logger(CloudinaryService.name);
  constructor(private config: ConfigService) {
    v2.config({
      cloud_name: config.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: config.get<string>('CLOUDINARY_API_KEY'),
      api_secret: config.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadFile(
    data: Uint8Array,
    docType: FILE_TYPE,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    const response: UploadApiResponse | UploadApiErrorResponse =
      await new Promise((resolve, reject) => {
        v2.uploader
          .upload_stream(
            {
              resource_type: 'auto',
              folder: this.config.get<string>(this.getFolder(docType)),
            },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            },
          )
          .end(Buffer.from(data));
      });
    this.logger.debug('File upload response: ', response.public_id);

    if (response.secure_url && response.public_id) {
      // return { url: response.secure_url, publicId: response.public_id };
      return response;
    }
  }

  private getFolder(docType: FILE_TYPE): string {
    let cloudinaryFolder: string;
    switch (docType) {
      case FILE_TYPE.CAR_IMAGES:
        cloudinaryFolder = 'CAR_IMAGES_FOLDER';
        break;
      case FILE_TYPE.CAR_LOGOS:
        cloudinaryFolder = 'CAR_LOGOS_FOLDER';
        break;
      default:
        cloudinaryFolder = 'CAR_IMAGES_FOLDER';
        break;
    }
    return cloudinaryFolder;
  }

  async deleteFile(publicId: string): Promise<void> {
    await v2.uploader.destroy(publicId);
    this.logger.debug('File deleted successfully');
  }
}

import { Injectable, BadRequestException } from '@nestjs/common';
import { UploadApiResponse, UploadApiErrorResponse, v2 } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
  async uploadImage(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    if (!file) {
      throw new BadRequestException('Invalid file type. Only images are allowed.');
    }

    try {
      return await new Promise((resolve, reject) => {
        const upload = v2.uploader.upload_stream((error, result) => {
          if (error) {
            reject(new BadRequestException('Failed to upload image to Cloudinary.'));
            return;
          }
          resolve(result);
        });

        const bufferStream = Readable.from(file.buffer);
        bufferStream.pipe(upload);
      });
    } catch (error) {
      throw new BadRequestException('Failed to upload image to Cloudinary.');
    }
  }

  async deleteImageByUrl(imageUrl: string): Promise<boolean> {
    try {
      //console.log('Attempting to delete image from Cloudinary. URL:', imageUrl);
      const publicIdMatch = imageUrl.split('/').pop();
      const publicId = publicIdMatch ? publicIdMatch.split('.')[0] : null;
  
      if (!publicId) {
        throw new BadRequestException('Invalid Cloudinary image URL.');
      }
  
      const result = await v2.uploader.destroy(publicId);
  
      if (result.result !== 'ok') {
        throw new BadRequestException('Failed to delete image from Cloudinary.');
      }
  
      console.log('Image deleted successfully.');
      return true;
    } catch (error) {
      console.error('Error deleting image from Cloudinary:', error);
      return false;
    }
  }
  
  
  
}

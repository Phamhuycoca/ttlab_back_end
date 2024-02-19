import { Injectable, BadRequestException } from '@nestjs/common';
import { UploadApiResponse, UploadApiErrorResponse, v2 } from 'cloudinary';
import toStream from 'buffer-to-stream';

@Injectable()
export class CloudinaryService {
  async uploadImage(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    //if (!file || !file.mimetype.startsWith('image/')) {
      if (!file) {
      throw new BadRequestException('Invalid file type. Only images are allowed.');
    }

    try {
      return await new Promise((resolve, reject) => {
        const upload = v2.uploader.upload_stream((error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(new BadRequestException('Failed to upload image to Cloudinary.'));
            return;
          }
          resolve(result);
        });

        toStream(file.buffer).pipe(upload);
      });
    } catch (error) {
      console.error('Error uploading image to Cloudinary:', error);
      throw new BadRequestException('Failed to upload image to Cloudinary.');
    }
  }
  async deleteImageByUrl(imageUrl: string): Promise<void> {
    try {
      const publicIdMatch = imageUrl.match(/\/v\d+\/(.+?)(\.[a-zA-Z0-9]+)?$/);
      if (!publicIdMatch || !publicIdMatch[1]) {
        throw new BadRequestException('Invalid Cloudinary image URL.');
      }
      const publicId = publicIdMatch[1];
      const result = await v2.uploader.destroy(publicId);
      if (result.result !== 'ok') {
        throw new BadRequestException('Failed to delete image from Cloudinary.');
      }
    } catch (error) {
      console.error('Error deleting image from Cloudinary:', error);
      throw new BadRequestException('Failed to delete image from Cloudinary.');
    }
  }
}

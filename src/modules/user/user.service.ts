import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from 'src/database/schemas/user.schema';
import { BaseService } from 'src/common/base/base.service';
import { GetUserListQuery, UpdateUserDto, createUserDto } from './dto/user.interface';
import { Types } from 'mongoose';
import { UserAttributesForList } from './dto/user.constant';
import { UserRepository } from './repository/user.repository';
import { CloudinaryService } from './../cloudinary/cloudinary.service';

@Injectable()
export class UserService extends BaseService<User, UserRepository> {
  constructor(private readonly userRepository: UserRepository,private readonly cloudinary:CloudinaryService) {
    super(userRepository);
  }
  async uploadImageToCloudinary(file: Express.Multer.File): Promise<string> {
    try {
      if (!file || !file.mimetype.startsWith('image/')) {
        throw new BadRequestException('Invalid file type. Only images are allowed.');
      }
      const result = await this.cloudinary.uploadImage(file);
      return result.secure_url;
    } catch (error) {
      this.logger.error('Failed to upload image to Cloudinary: ' + error);
      throw error;
    }
  }
  async deleteImageByUrl(imageUrl: string): Promise<void> {
    try{
        const res=await this.cloudinary.deleteImageByUrl(imageUrl);
    }catch(error){
      this.logger.error('Error in delete ImageCloudinary: ' + error);
      throw error;
    }
  }
  async _createUser(dto: createUserDto) {
    try {
      const user: SchemaCreateDocument<User> = {
        ...(dto as any),
      };
      const res = await this.userRepository.createOne(user);
      return res;
    } catch (error) {
      this.logger.error('Error in userService create user: ' + error);
      throw error;
    }
  }
  async _updateUser(id: Types.ObjectId, dto: UpdateUserDto) {
    try {
      await this.userRepository.updateOneById(id, dto);
      return await this._findUserById(id);
    } catch (error) {
      this.logger.error('Error in userService update user: ' + error);
      throw error;
    }
  }
  async _findUserById(
    id: Types.ObjectId,
    attributes: (keyof User)[] = UserAttributesForList,
  ) {
    try {
      return await this.userRepository.getOneById(id, attributes);
    } catch (error) {
      this.logger.error('Error in UserService findUserById: ' + error);
      throw error;
    }
  }

  async _deleteUser(id: Types.ObjectId) {
    try {
        await this.userRepository.softDeleteOne({ _id: id });
        return { id };
    } catch (error) {
        this.logger.error('Error in UserService deleteUser: ' + error);
        throw error;
    }
}

async _findAllAndCountUserByQuery(query: GetUserListQuery) {
  try {
      const result =
          await this.userRepository.findAllAndCountUserByQuery(query);
      return result;
  } catch (error) {
      this.logger.error(
          'Error in UserService findAllAndCountUserByQuery: ' + error,
      );
      throw error;
  }
}
}

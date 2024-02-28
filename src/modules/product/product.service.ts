import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseService } from '../../common/base/base.service';
import { Product } from '../../database/schemas/product.schema';
import { ProductRepository } from './repository/product.repository';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { GetProductListQuery, createProductDto, updateProductDto } from './dto/product.interface';
import { Types } from 'mongoose';
import { ProductAttributesForList } from './dto/product.contant';

@Injectable()
export class ProductService extends BaseService<Product,ProductRepository>{
  constructor(private readonly productRepository: ProductRepository,private readonly cloudinary:CloudinaryService) {
    super(productRepository);
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

  async _createProduct(dto: createProductDto) {
    try {
      const product: SchemaCreateDocument<Product> = {
        ...(dto as any),
      };
      const res = await this.productRepository.createOne(product);
      return res;
    } catch (error) {
      this.logger.error('Error in productService createproduct: ' + error);
      throw error;
    }
  }
  async _updateProduct(id: Types.ObjectId, dto: updateProductDto) {
    try {
      await this.productRepository.updateOneById(id, dto);
      return await this._findProductById(id);
    } catch (error) {
      this.logger.error('Error in ProductService updateProduct: ' + error);
      throw error;
    }
  }
  async _findProductById(
    id: Types.ObjectId,
    attributes: (keyof Product)[] = ProductAttributesForList,
  ) {
    try {
      return await this.productRepository.getOneById(id, attributes);
    } catch (error) {
      this.logger.error('Error in ProductService findProductById: ' + error);
      throw error;
    }
  }

  async _deleteProduct(id: Types.ObjectId) {
    try {
        await this.productRepository.softDeleteOne({ _id: id });
        return { id };
    } catch (error) {
        this.logger.error('Error in ProductService deleteProduct: ' + error);
        throw error;
    }
}

async _findAllAndCountProductByQuery(query: GetProductListQuery) {
  try {
      const result =
          await this.productRepository.findAllAndCountUserByQuery(query);
      return result;
  } catch (error) {
      this.logger.error(
          'Error in ProductService findAllAndCountProductByQuery: ' + error,
      );
      throw error;
  }
}
async checkName(name:string) {
  try {
    const result = await this.productRepository.findOne({name:name});
    if(result) {
      return true;
    }
    return false;
  } catch (error) {
    this.logger.error(
      'Error in ProductService checkName: ' + error,
    );
    throw error;
  }
}
}

import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ProductRepository } from './repository/product.repository';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from 'src/database/schemas/product.schema';

@Module({
  imports: [
    CloudinaryModule,
    MongooseModule.forFeature([
        { name: Product.name, schema: ProductSchema },
    ]),
],
  controllers: [ProductController],
  providers: [ProductService,ProductRepository],
})
export class ProductModule {}

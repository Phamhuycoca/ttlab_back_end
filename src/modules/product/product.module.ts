import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ProductRepository } from './repository/product.repository';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from '../../database/schemas/product.schema';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { UserRepository } from '../user/repository/user.repository';
import { User, UserSchema } from '../../database/schemas/user.schema';

@Module({
  imports: [
    CloudinaryModule,
    MongooseModule.forFeature([
        { name: Product.name, schema: ProductSchema },
    ]),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
  ]),
],
  controllers: [ProductController],
  providers: [ProductService,ProductRepository,JwtService,UserService,UserRepository],
})
export class ProductModule {}

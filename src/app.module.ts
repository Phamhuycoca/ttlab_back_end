import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MongoModule } from './database/connectDB/mongo.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ProductModule } from './modules/product/product.module';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './modules/user/user.service';
import { CloudinaryService } from './modules/cloudinary/cloudinary.service';

@Module({
  imports: [
  MongoModule,
    AuthModule,
    UserModule,
    ProductModule,
  ],
  controllers: [AppController],
  providers: [JwtService,UserService,CloudinaryService],
})
export class AppModule {}

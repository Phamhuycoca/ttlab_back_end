import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MongoModule } from './database/connectDB/mongo.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ProductModule } from './modules/product/product.module';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './modules/user/user.service';
import { CloudinaryService } from './modules/cloudinary/cloudinary.service';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
  MongoModule,
    AuthModule,
    UserModule,
    ProductModule,
    // MailerModule.forRoot({
    //   transport: {
    //     host: 'smtp.gmail.com',
    //     port: 587,
    //     secure: false,
    //     auth: {
    //       user: 'huypk@tokyotechlab.com',
    //       pass: 'nfgw itse vfkk tuah',
    //     },
    //   },
    //   defaults: {
    //     from: '"Xác nhận quên mật khẩu" <no-reply@example.com>',
    //   },
    // })
  ],
  controllers: [AppController],
  providers: [JwtService,UserService,CloudinaryService],
})
export class AppModule {}

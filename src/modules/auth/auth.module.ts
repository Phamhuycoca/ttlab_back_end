import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../../database/schemas/user.schema';
import { AuthRepository } from './repository/auth.repository';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { jwtConstants } from '../../common/constants';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserRepository } from '../user/repository/user.repository';
import { UserService } from '../user/user.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { MailerModule, MailerService } from '@nestjs-modules/mailer';

@Module({
  imports:[
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
  ]),
  JwtModule.register({
    secret: jwtConstants.secret,
    signOptions: { expiresIn: jwtConstants.expiresIn },
  }),
      MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: 'huypk@tokyotechlab.com',
          pass: 'nfgw itse vfkk tuah',
        },
      },
      defaults: {
        from: '"Xác nhận quên mật khẩu" <no-reply@example.com>',
      },
    })
  ],
  controllers: [AuthController],
  providers: [AuthService,AuthRepository,JwtService,JwtStrategy,UserRepository,UserService,CloudinaryService],
})
export class AuthModule {}

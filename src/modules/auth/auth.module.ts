import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/database/schemas/user.schema';
import { AuthRepository } from './repository/auth.repository';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { jwtConstants } from 'src/common/constants';

@Module({
  imports:[
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
  ]),
  JwtModule.register({
    secret: jwtConstants.secret,
    signOptions: { expiresIn: jwtConstants.expiresIn },
  }),
  ],
  controllers: [AuthController],
  providers: [AuthService,AuthRepository,JwtService],
})
export class AuthModule {}

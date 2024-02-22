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
  providers: [AuthService,AuthRepository,JwtService,JwtStrategy,UserRepository],
})
export class AuthModule {}

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { BaseService } from 'src/common/base/base.service';
import { User } from 'src/database/schemas/user.schema';
import { AuthRepository } from './repository/auth.repository';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/auth.interface';
import { jwtConstants } from 'src/common/constants';

@Injectable()
export class AuthService extends BaseService<User,AuthRepository>{
    constructor(
        private readonly authRepository: AuthRepository,
        private jwtService: JwtService,
    ) {
        super(authRepository);
    }

    async login(dto:LoginDto){
        try{
            const user = await this.authRepository.findOne(dto);
            if (user?.password !==dto.password) {
                throw new UnauthorizedException();
            }
            const payload = { sub: user._id, email: user.email, roles: user.role };
            const accessToken = this.jwtService.sign(payload, {
                secret: jwtConstants.secret,
                expiresIn: jwtConstants.expiresIn,
            });
            const refreshToken = this.jwtService.sign(payload, {
                secret: jwtConstants.secret,
                expiresIn: jwtConstants.refresh_expiresIn,
            });
            return {
               data:{
                accessToken: accessToken,
                expiresIn: jwtConstants.expiresIn,
                refresh_token: refreshToken,
                refresh_expiresIn:jwtConstants.refresh_expiresIn,
                profile:{
                    role:user.role,
                }
               }
            };
        }catch(error){
            this.logger.error('Error in Login: ' + error);
            throw error;
        }
    }
}

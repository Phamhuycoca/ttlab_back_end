import { Injectable } from "@nestjs/common";
import { BaseService } from "../../common/base/base.service";
import { User } from "../../database/schemas/user.schema";
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from "../../common/constants";
import { AuthRepository } from "./repository/auth.repository";
import { LoginDto } from "./dto/auth.interface";
import * as jwt from 'jsonwebtoken';
import { UserRepository } from './../user/repository/user.repository';
@Injectable()
export class AuthService extends BaseService<User,AuthRepository>
{
    constructor(
        private readonly authRepository: AuthRepository,
        private jwtService: JwtService,
        private readonly userRepository:UserRepository
    ) {
        super(authRepository);
    }
    async Login(dto:LoginDto)
    {
        try
        {
        const data=await this.authRepository.findOne(dto);
        if(!data)
            return null
            const access_token = await this.jwtService.signAsync(
                { data },
                {
                    secret: jwtConstants.secret,
                    expiresIn: jwtConstants.expiresIn,
                },
            );
            const refresh_token = await this.jwtService.signAsync(
                { data },
                {
                    secret: jwtConstants.secret,
                    expiresIn: jwtConstants.refresh_expiresIn,
                },
            );
            return {
                data:{
                    accessToken: access_token,
                    expiresIn: jwtConstants.expiresIn,
                    refresh_token: refresh_token,
                    refresh_expiresIn:jwtConstants.refresh_expiresIn,
                    profile:{
                        role:data.role,
                    }
                   }
            };
        }catch(error)
        {
            this.logger.error('Error in autherService login: ' + error);
            throw error;
        }
    }
   
      
    async generateRefreshToken(data: any){
        try{
            const access_token = await this.jwtService.signAsync(
                { data },
                {
                    secret: jwtConstants.secret,
                    expiresIn: jwtConstants.refresh_expiresIn,
                },
            );
            return {
                data:{
                    accessToken: access_token,
                    expiresIn: jwtConstants.refresh_expiresIn,
                    profile:{
                        role:data.data.role,
                    }
                }
            };
        }catch(error){
            this.logger.error('Error in refresh token',error);
            throw error;
        }
      }

    verifyToken(token: string): any {
        try {
          return jwt.verify(token, jwtConstants.secret);
        } catch (error) {
          return null;
        }
      }
      async checkEmail(email:string) {
        try {
          const result = await this.userRepository.findEmail(email);
          if(result) {
            return true;
          }
          return false;
        } catch (error) {
          this.logger.error(
            'Error in UserService checkEmail: ' + error,
          );
          throw error;
        }
      }
}
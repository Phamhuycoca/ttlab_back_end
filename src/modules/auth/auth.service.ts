import { Injectable, UnauthorizedException } from "@nestjs/common";
import { BaseService } from "../../common/base/base.service";
import { User } from "../../database/schemas/user.schema";
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from "../../common/constants";
import { AuthRepository } from "./repository/auth.repository";
import { LoginDto, RegisterDto } from "./dto/auth.interface";
import * as jwt from 'jsonwebtoken';
import { UserRepository } from './../user/repository/user.repository';
import { MailerService } from '@nestjs-modules/mailer';
@Injectable()
export class AuthService extends BaseService<User,AuthRepository>
{
    
    constructor(
        private readonly authRepository: AuthRepository,
        private jwtService: JwtService,
        private readonly userRepository:UserRepository,
        private readonly mailerService:MailerService
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
                        avatar:data.avatar
                    }
                   }
            };
        }catch(error)
        {
            this.logger.error('Error in autherService login: ' + error);
            throw error;
        }
    }
   async Register(dto:RegisterDto){
    try {
        const user: SchemaCreateDocument<User> = {
          ...(dto as any),
        };
        const res = await this.userRepository.createOne(user);
        return res;
      } catch (error) {
        this.logger.error('Error in userService create user: ' + error);
        throw error;
      }
   }
      
    // async generateRefreshToken(res: any){
    //     try{
    //         const data = res.data;
    //         const access_token = await this.jwtService.signAsync(
    //             { data },
    //             {
    //                 secret: jwtConstants.secret,
    //                 expiresIn: jwtConstants.refresh_expiresIn,
    //             },
    //         );
            
    //         return {
    //                 data:{
    //                     accessToken: access_token,
    //                     expiresIn: jwtConstants.refresh_expiresIn,
    //                     profile:{
    //                         role:data.role,
    //                     }
    //                    }
    //         };
    //     }catch(error){
    //         this.logger.error('Error in refresh token',error);
    //         throw error;
    //     }
    //   }

    async verifyToken(token: string){
        try {
          return await jwt.verify(token, jwtConstants.secret);
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

      async refreshToken(refreshtoken) {
        try {
            const {data} = await this.jwtService.verify(refreshtoken, {
                secret: jwtConstants.secret,
              });
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
            }
        } catch (e) {
            throw new UnauthorizedException("Hết phiên đăng nhập. vui lòng đăng nhập lại");
        }
      }

       generateRandomPassword(): string {
        const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let password = '';
    
        for (let i = 0; i <= 8; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            password += characters.charAt(randomIndex);
        }
        return password;
    }
    
    async sendEmail(toEmail:string,password_new:string){
       try{
        return await this.mailerService.sendMail({
            to:toEmail,
            from:'huypk@tokyotechlab.com',
            subject:'Xác nhận mật khẩu',
            text:'Mật khẩu mới của bạn là: '+password_new +'\n'+
            `link đăng nhập: https://ttlab-front-end.vercel.app/login`            
        });
       }catch(error){
        this.logger.error(
            'Error in Send email: ' + error,
          );
          throw error;
       }
    }
}
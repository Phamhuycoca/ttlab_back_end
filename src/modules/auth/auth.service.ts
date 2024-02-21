import { Injectable } from "@nestjs/common";
import { BaseService } from "../../common/base/base.service";
import { User } from "../../database/schemas/user.schema";
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from "../../common/constants";
import { AuthRepository } from "./repository/auth.repository";
import { LoginDto } from "./dto/auth.interface";

@Injectable()
export class AuthService extends BaseService<User,AuthRepository>
{
    constructor(
        private readonly authRepository: AuthRepository,
        private jwtService: JwtService,
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
}
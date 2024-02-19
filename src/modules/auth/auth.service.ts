import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/base/base.service';
import { User } from 'src/database/schemas/user.schema';
import { AuthRepository } from './repository/auth.repository';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/auth.interface';

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

        }catch(error){

        }
    }
}

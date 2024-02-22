import { Controller, Get, Post, Body, Patch, Param, Delete, UnauthorizedException, HttpStatus, HttpException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { LoginDto } from './dto/auth.interface';
import { TrimBodyPipe } from '../../common/helper/pipe/trim.body.pipe';
import { BaseController } from '../../common/base/base.controller';
import { ErrorResponse, SuccessResponse } from 'src/common/helper/response';
import { BadRequestException } from '@nestjs/common';

@Controller('auth')
export class AuthController extends BaseController{
  constructor(private readonly authService: AuthService) {
    super();
  }

  @Post('login')
  @ApiBody({type:LoginDto})
  @ApiOperation({ summary: 'Login' })
  async Login(@Body(new TrimBodyPipe()) dto:LoginDto){
    try{
      if(await this.authService.checkEmail(dto.email)){
        const res= await this.authService.Login(dto);
        if(res!=null){
          return res;
        }
        throw new BadRequestException('Tài khoản mật khẩu không chính xác');
      }
      throw new BadRequestException('Email không tồn tại');

    }catch(error){
      this.handleError(error);
    }
  }

  @Get('token')
  async sendRefreshToken(@Body('refresh_token') refreshToken: string) {
   try{
    const decodedToken = this.authService.verifyToken(refreshToken);
    console.log(decodedToken);
    if (decodedToken) {
      const newRefreshToken =await this.authService.generateRefreshToken(decodedToken);
      return new SuccessResponse(newRefreshToken);
    } else {
      throw new UnauthorizedException('Invalid refresh token');
    }
   }catch(error){
    this.handleError(error);
   }

  }
}

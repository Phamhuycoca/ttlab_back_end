import { Controller, Get, Post, Body, Patch, Param, Delete, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { LoginDto } from './dto/auth.interface';
import { TrimBodyPipe } from '../../common/helper/pipe/trim.body.pipe';
import { BaseController } from '../../common/base/base.controller';
import { SuccessResponse } from 'src/common/helper/response';

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
      return await this.authService.Login(dto);
    }catch(error){
      this.handleError(error);
    }
  }
  // @Get('token')
  // getToken(){
  //   console.log('returning token');
    
  // }
  @Get('token')
  async sendRefreshToken(@Body('refresh_token') refreshToken: string) {
    console.log('returning refresh');
    try{
    const decodedToken = this.authService.verifyToken(refreshToken);
    console.log(decodedToken);
    if (decodedToken) {
      return await this.authService.generateRefreshToken(decodedToken);
    } else {
      throw new UnauthorizedException('Invalid refresh token');
    }
   }catch(error){
    this.handleError(error);
   }

  }
}

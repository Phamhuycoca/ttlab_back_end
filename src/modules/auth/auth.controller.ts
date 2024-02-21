import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { LoginDto } from './dto/auth.interface';
import { TrimBodyPipe } from '../../common/helper/pipe/trim.body.pipe';
import { BaseController } from '../../common/base/base.controller';

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
  @Get('token')
  getToken(){
    console.log('returning token');
    
  }
}

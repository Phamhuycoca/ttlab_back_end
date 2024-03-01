import { Controller, Get, Post, Body, Patch, Param, Delete, UnauthorizedException, HttpException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { LoginDto, forgotPassword } from './dto/auth.interface';
import { TrimBodyPipe } from '../../common/helper/pipe/trim.body.pipe';
import { BaseController } from '../../common/base/base.controller';
import { ErrorResponse, SuccessResponse } from 'src/common/helper/response';
import { BadRequestException } from '@nestjs/common';
import { Role } from 'src/common/decorator/roles.decorator';
import { RoleCollection,HttpStatus } from 'src/common/constants';
import { AuthGuard } from "../auth/guard/auth.guard";
import { RolesGuard } from './guard/role.guard';
import { LoggedInUser } from 'src/common/decorator/loggedInUser.decorator';
import { UserService } from './../user/user.service';
import { toObjectId } from 'src/common/helper/commonFunction';

@Controller('auth')
export class AuthController extends BaseController{
  constructor(private readonly authService: AuthService,private readonly UserService:UserService) {
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
            return new SuccessResponse(res);
        }
        throw new UnauthorizedException('Tài khoản mật khẩu không chính xác');
      }
      throw new UnauthorizedException('Email không tồn tại');

    }catch(error){
      this.handleError(error);
    }
  }
  @Post('refresh')
  async sendRefreshToken(@Body() body: any) {
   try{
    const decodedToken =await this.authService.verifyToken(body.refresh_token);
    if (decodedToken) {
      const newRefreshToken =await this.authService.refreshToken(body.refresh_token);
      return new SuccessResponse(newRefreshToken);
    } else {
      throw new UnauthorizedException('Invalid refresh token');
    }
   }catch(error){
    this.handleError(error);
   }
  }
  @Role(RoleCollection.Admin || RoleCollection.USERS)
  @UseGuards(AuthGuard,RolesGuard)
  @Get('user')
  async getUser(@LoggedInUser() loggedInUser)
  {
    // console.log(loggedInUser.id);
      try{
        
        // const id=loggedInUser.data.id;
          const id=loggedInUser.id;
          const result = await this.UserService._findUserById(id);
          if (!result) {
              return new ErrorResponse(
                  HttpStatus.ITEM_NOT_FOUND,
                   "User not found"
              );
          }
          return new SuccessResponse(result);
      }catch(error)
      {
          this.handleError(error);
      }
  }



  @Post('forgot-password')
  async forgotPassword(@Body(new TrimBodyPipe()) dto:forgotPassword){
    try{
      const result = await this.UserService.findUserByEmail(dto.email);
      if(!result){
        throw new BadRequestException("Email không tồn tại");
        // return new ErrorResponse(
        //   HttpStatus.BAD_REQUEST,
        //   "Không tìm thấy email"
        //   );
        }
          const password=this.authService.generateRandomPassword();
          const updatePass=await this.UserService._updateUser(toObjectId(result.id),{password:password});
          const send_email=await this.authService.sendEmail(dto.email,password);
          return new SuccessResponse(send_email);
    }catch(error){
      this.handleError(error);
    }
  }
  
}

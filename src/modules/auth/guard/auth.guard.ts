import {
    CanActivate,
    ExecutionContext,
    HttpException,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';
  import { jwtConstants } from '../../../common/constants';
  import { Request } from 'express';
import { UserService } from '../../user/user.service';
  
  @Injectable()
  export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService,private userService:UserService) {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      const token = this.extractTokenFromHeader(request);
      if (!token) {
        throw new UnauthorizedException();
      }
      try {
        const payload = await this.jwtService.verifyAsync(
          token,
          {
            secret: jwtConstants.secret
          }
          );
        const user=await this.userService._findUserById(payload.data.id)
        // console.log(user);
        if(!user)
        {
          throw new UnauthorizedException();
        }
        // console.log(payload.data);
        request.loggedInUser=payload.data
        request.userToken=token
        // console.log(request.loggedInUser)
      } catch {
        throw new HttpException({
            status: 419,
            message: "Hết thời gian đăng nhập. Vui lòng đăng nhập lại"
        }, 419)
      }
      return true;
    }
  
    private extractTokenFromHeader(request: Request): string | undefined {
      const [type, token] = request.headers.authorization?.split(' ') ?? [];
      return type === 'Bearer' ? token : undefined;
    }
  }
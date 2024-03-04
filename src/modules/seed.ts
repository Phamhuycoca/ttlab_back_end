// src/seeders/user.seeder.ts

import { Injectable } from '@nestjs/common';
import { UserService } from './user/user.service';
import { createUserDto } from './user/dto/user.interface';
import { RoleCollection } from '../common/constants';

@Injectable()
export class UserSeeder {
  constructor(private readonly userService: UserService) {}

  async seed() {
    const dto = new createUserDto();
    dto.avatar = "https://res.cloudinary.com/drhdgw1xx/image/upload/v1708436675/oo1cyymbde1uyiupmqsp.jpg";
    dto.name = "Đinh Thị Lan Anh";
    dto.email = "lanhjjj@gmail.com";
    dto.birthday = "2002-10-10";
    dto.password = "12345678a";
    dto.phone = "0904319381";
    dto.role = RoleCollection.Admin;
    if (!await this.userService.findUserByEmail(dto.email)) {
      await this.userService._createUser(dto);
      console.log('Tạo thành công');
    } else {
      console.log('User đã tồn tại');
    }
    
  }
}

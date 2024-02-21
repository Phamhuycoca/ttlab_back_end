import { Controller, Get, UseGuards } from '@nestjs/common';
import { LoggedInUser } from './common/decorator/loggedInUser.decorator';
import { RoleCollection } from './common/constants';
import { Role } from './common/decorator/roles.decorator';
import { RolesGuard } from './modules/auth/guard/role.guard';
import { AuthGuard } from './modules/auth/guard/auth.guard';

@Controller()
export class AppController {
  @Role(RoleCollection.Admin)
  @UseGuards(AuthGuard,RolesGuard)
  @Get()
  getHello(@LoggedInUser() loggedInUser): string {
    console.log(loggedInUser.data.id)
    return 'Hello'
  }
}

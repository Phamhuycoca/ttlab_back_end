import { BadRequestException, Body, Controller, Delete, Get, HttpException, Param, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { BaseController } from "../../common/base/base.controller";
import { UserService } from "./user.service";
import { GetUserListQuery, UpdateUserDto, createUserDto } from "./dto/user.interface";
import { TrimBodyPipe } from "../../common/helper/pipe/trim.body.pipe";
import { ErrorResponse, SuccessResponse } from "../../common/helper/response";
import mongoose from "mongoose";
import { toObjectId } from "../../common/helper/commonFunction";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBody, ApiOperation } from "@nestjs/swagger";
import { HttpStatus, RoleCollection } from "../../common/constants";
import { Role } from "../../common/decorator/roles.decorator";
import { AuthGuard } from "../auth/guard/auth.guard";
import { RolesGuard } from "../auth/guard/role.guard";
import { LoggedInUser } from "src/common/decorator/loggedInUser.decorator";


@Controller('user')
export class UserController extends BaseController{
    constructor(
        private readonly UserService: UserService
    ) {
        super();
    }
            // @Role(RoleCollection.Admin)
    @UseGuards(AuthGuard)
    @Get()
    async getAllUser(@Query()query :GetUserListQuery,@LoggedInUser() loggedInUser)
    {
        try{
            const id =loggedInUser.id;
            const result=await this.UserService._findAllAndCountUserByQuery(query,id);
            return new SuccessResponse(result);
        }catch(error){
            this.handleError(error);
        }
    }
    @Role(RoleCollection.Admin)
    @UseGuards(AuthGuard, RolesGuard)
    @ApiOperation({ summary: 'Create User' })
    @ApiBody({ type: createUserDto })
    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async createUser(@Body(new TrimBodyPipe()) dto: createUserDto,@UploadedFile() file: Express.Multer.File)
    {
        try{
            // console.log(await this.UserService.checkEmail(dto.email));
           if(!await this.UserService.checkEmail(dto.email)){
            file !=null ? dto.avatar=await this.UserService.uploadImageToCloudinary(file) : dto.avatar='';
            const result=await this.UserService._createUser(dto)
            return new SuccessResponse(result)
           }
           throw new BadRequestException('Email đã tồn tại');
        }catch (error) {
            this.handleError(error);
        }
    }
    @Put(':id')
    @UseInterceptors(FileInterceptor('file'))
    async updateUser(@Param('id')id:string,
    @Body(new TrimBodyPipe())
    dto:UpdateUserDto, @UploadedFile() file: Express.Multer.File)
    {
        try
        {
            const user = await this.UserService._findUserById(toObjectId(id));
            if (!user) {
                return new ErrorResponse(
                    HttpStatus.ITEM_NOT_FOUND,
                     "User not found"
                );
            }
            if(user.email!==dto.email){
                if(await this.UserService.checkEmail(dto.email))
                throw new HttpException('Email đã tồn tại',HttpStatus.BAD_REQUEST);
            }
            if(file !=null){
                if(user.avatar!==''){
                    this.UserService.deleteImageByUrl(user.avatar);
                }
            }
        //    if(!await this.UserService.checkEmail(dto.email)){
               file !=null ? dto.avatar=await this.UserService.uploadImageToCloudinary(file) : dto.avatar=user.avatar;
               const result=await this.UserService._updateUser(toObjectId(id),dto);
               if(result)
               return new SuccessResponse(result)
        //     }else{
        //    throw new BadRequestException('Email đã tồn tại');

            // }
            throw new HttpException("Update error",HttpStatus.INTERNAL_SERVER_ERROR);
        }
        catch(error)
        {
            this.handleError(error);
        }
    }
    @Get(':id')
    async getUserById(@Param('id')id:string,)
    {
        try{
            
            const result = await this.UserService._findUserById(toObjectId(id));
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
    @Delete(':id')
    async deleteUser(@Param('id')id:string,)
    {
      try{
        const user = await this.UserService._findUserById(toObjectId(id));
        if (!user) {
            return new ErrorResponse(
                HttpStatus.NOT_FOUND,
                 "User not found"
            );
        }
        console.log(user.avatar);
        if(user.avatar !==''){
            this.UserService.deleteImageByUrl(user.avatar);
        }
        const result=await this.UserService._deleteUser(toObjectId(id))
        return new SuccessResponse(result);
      }catch(error){
        this.handleError(error);

      }
    }
   
  }
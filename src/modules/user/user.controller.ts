import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Query } from "@nestjs/common";
import { BaseController } from "src/common/base/base.controller";
import { UserService } from "./user.service";
import { GetUserListQuery, UpdateUserDto, createUserDto } from "./dto/user.interface";
import { TrimBodyPipe } from "src/common/helper/pipe/trim.body.pipe";
import { SuccessResponse } from "src/common/helper/response";
import mongoose from "mongoose";
import { toObjectId } from "src/common/helper/commonFunction";


@Controller('user')
export class UserController extends BaseController{
    constructor(
        private readonly UserService: UserService
    ) {
        super();
    }
    @Get()
    async getAllUser(@Query()query :GetUserListQuery)
    {
        return await this.UserService._findAllAndCountUserByQuery(query);
    }
    @Post()
    async createUser(@Body(new TrimBodyPipe()) dto: createUserDto)
    {
        try{
            const result=await this.UserService._createUser(dto)
            return new SuccessResponse(result)
        }catch (error) {
            this.handleError(error);
        }
    }
    @Put(':id')
    async updateUser(@Param('id')id:string,
    @Body(new TrimBodyPipe())
    dto:UpdateUserDto)
    {
        try
        {
            const result=await this.UserService._updateUser(toObjectId(id),dto);
            if(result)
                return new SuccessResponse(result)
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
            const isValid=mongoose.Types.ObjectId.isValid(id)
            if(!isValid)
            {
                throw new HttpException("Id không giống định dạng",HttpStatus.BAD_REQUEST);
            }
            const result = await this.UserService._findUserById(toObjectId(id));
            if(result)
                return new SuccessResponse(result);
            throw new HttpException("Not found",HttpStatus.NOT_FOUND);
        }catch(error)
        {
            this.handleError(error);
        }
    }
    @Delete(':id')
    async deleteUser(@Param('id')id:string,)
    {
        const result=await this.UserService._deleteUser(toObjectId(id))
        if(result)
            return new SuccessResponse(result);
        throw new HttpException("Không tìm thấy product",HttpStatus.NOT_FOUND);
    }
  }
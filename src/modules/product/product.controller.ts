import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors, UploadedFile, Put, HttpException, UseGuards, BadRequestException } from '@nestjs/common';
import { ProductService } from './product.service';
import { BaseController } from '../../common/base/base.controller';
import { GetProductListQuery, createProductDto, updateProductDto } from './dto/product.interface';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { TrimBodyPipe } from '../../common/helper/pipe/trim.body.pipe';
import { ErrorResponse, SuccessResponse } from '../../common/helper/response';
import { toObjectId } from '../../common/helper/commonFunction';
import { HttpStatus, RoleCollection } from '../../common/constants';
import { AuthGuard } from '../auth/guard/auth.guard';
import { RolesGuard } from '../auth/guard/role.guard';
import { Role } from '../../common/decorator/roles.decorator';
import { LoggedInUser } from '../../common/decorator/loggedInUser.decorator';

@Controller('product')
export class ProductController extends BaseController{
  constructor(private readonly productService: ProductService) {
    super();
  }
//   @Role(RoleCollection.Admin)
//   @UseGuards(AuthGuard,RolesGuard)
  @Get()
    async getAllProduct(@Query()query :GetProductListQuery)
    {
        try{
            const result= await this.productService._findAllAndCountProductByQuery(query);
            return new SuccessResponse(result);
        }catch(error){
            this.handleError(error);
        }
    }

    @ApiOperation({ summary: 'Create Product' })
    @ApiBody({ type:  createProductDto})
    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async createProduct(@Body(new TrimBodyPipe()) dto: createProductDto,@UploadedFile() file: Express.Multer.File,@LoggedInUser() loggedInUser)
    {
        try{
            if(!await this.productService.checkName(dto.name)){
                file !=null ? dto.image=await this.productService.uploadImageToCloudinary(file) : dto.image='';
                const result=await this.productService._createProduct(dto)
                return new SuccessResponse(result)
            }
           throw new BadRequestException('Tên sản phẩm đã tồn tại');
        }catch (error) {
            this.handleError(error);
        }
    }
    @Put(':id')
    @ApiOperation({ summary: 'Update Product' })
    @UseInterceptors(FileInterceptor('file'))
    async updateProduct(@Param('id')id:string,
    @Body(new TrimBodyPipe())
    dto:updateProductDto, @UploadedFile() file: Express.Multer.File,@LoggedInUser() loggedInUser)
    {
        try
        {
            const product = await this.productService._findProductById(toObjectId(id));
            if (!product) {
                return new ErrorResponse(
                    HttpStatus.ITEM_NOT_FOUND,
                     "Product not found"
                );
            }
            if(file !=null){
                if(product.image!==''){
                    this.productService.deleteImageByUrl(product.image);
                }
            }
            // if(!await this.productService.checkName(dto.name)){
                file !=null ? dto.image=await this.productService.uploadImageToCloudinary(file) : dto.image=product.image;
                const result=await this.productService._updateProduct(toObjectId(id),dto);
                if(result)
                    return new SuccessResponse(result)
            // }else{
            // throw new BadRequestException('Tên sản phẩm đã tồn tại');
            // }
            throw new HttpException("Update error",HttpStatus.INTERNAL_SERVER_ERROR);
        }
        catch(error)
        {
            this.handleError(error);
        }
    }
    @Get(':id')
    async getProductById(@Param('id')id:string,)
    {
        try{
            
            const result = await this.productService._findProductById(toObjectId(id));
            if (!result) {
                return new ErrorResponse(
                    HttpStatus.ITEM_NOT_FOUND,
                     "Product not found"
                );
            }
            return new SuccessResponse(result);
        }catch(error)
        {
            this.handleError(error);
        }
    }
    @Delete(':id')
    async deleteProduct(@Param('id')id:string,)
    {
      try{
        const product = await this.productService._findProductById(toObjectId(id));
        if (!product) {
            return new ErrorResponse(
                HttpStatus.NOT_FOUND,
                 "Product not found"
            );
        }
        if(product.image !==''){
            this.productService.deleteImageByUrl(product.image);
        }
        const result=await this.productService._deleteProduct(toObjectId(id))
        return new SuccessResponse(result);
      }catch(error){
        this.handleError(error);

      }
    }


}

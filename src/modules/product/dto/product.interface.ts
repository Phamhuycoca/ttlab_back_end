import { IsNotEmpty, IsNumber, IsString, Matches } from "class-validator";
import { CommonListQuery } from "../../../common/interfaces";
import { ProoductOrderBy } from "./product.contant";
const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  const numberRegex= /^[0-9]+$/;
export class createProductDto{
    @IsString()
    // @IsNotEmpty({message:'Vui lòng nhập tên sản phẩm'})
    name?: string;
    // @Matches(numberRegex,({message:'Giá phải là số'}))
    // @IsNotEmpty({message:'Vui lòng nhập giá'})
    price: number;
    // @Matches(numberRegex,({message:'Số lượng phải là số'}))
    // @IsNotEmpty({message:'Vui lòng nhập số lượng'})
    quantity: number;
    // @IsString({message:'Chi tiết sản phẩm phải là chuỗi'})
    description?: string;
    image?: string;
}
export class updateProductDto{
    // @IsString({message:'Tên sản phẩm phải là chuỗi'})
    name?: string;
    // @Matches(numberRegex,({message:'Giá phải là số'}))
    price?: number;
    // @Matches(numberRegex,({message:'Số lượng phải là số'}))
    quantity?: number;
    // @IsString({message:'Mô tả phải là chuỗi'})
    description?: string;
    image?: string;
}

export class GetProductListQuery extends CommonListQuery {
    orderBy?: ProoductOrderBy;
}
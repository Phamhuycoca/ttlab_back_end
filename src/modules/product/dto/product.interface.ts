import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { CommonListQuery } from '../../../common/interfaces';
import { ProoductOrderBy } from './product.contant';
const numberRegex = /^[0-9]+$/;
export class createProductDto {
  @IsNotEmpty({ message: 'Vui lòng nhập tên sản phẩm' })
  name?: string;

  @Matches(numberRegex, { message: 'Giá phải là số' })
  @MinLength(0, { message: 'Giá không được nhỏ hơn 0' })
  @MaxLength(100000000, { message: 'Giá không được quá 100 triệu' })
  @IsNotEmpty({ message: 'Vui lòng nhập giá' })
  price: number;

  @Matches(numberRegex, { message: 'Số lượng phải là số' })
  @MinLength(0, { message: 'Số lượng không được nhỏ hơn 0' })
  @MaxLength(1000000, { message: 'Số lượng không được quá 1 triệu' })
  @IsNotEmpty({ message: 'Vui lòng nhập số lượng' })
  quantity: number;

  @IsString({ message: 'Chi tiết sản phẩm phải là chuỗi' })
  description?: string;
  image?: string;
}
export class updateProductDto {
  // @IsString({message:'Tên sản phẩm phải là chuỗi'})
  @IsNotEmpty({ message: 'Vui lòng nhập tên sản phẩm' })
  name?: string;

  @Matches(numberRegex, { message: 'Giá phải là số' })
  @MinLength(0, { message: 'Giá không được nhỏ hơn 0' })
  @MaxLength(100000000, { message: 'Giá không được quá 100 triệu' })
  @IsNotEmpty({ message: 'Vui lòng nhập giá' })
  price: number;
  
  @Matches(numberRegex, { message: 'Số lượng phải là số' })
  @MinLength(0, { message: 'Số lượng không được nhỏ hơn 0' })
  @MaxLength(1000000, { message: 'Số lượng không được quá 1 triệu' })
  @IsNotEmpty({ message: 'Vui lòng nhập số lượng' })
  quantity: number;

  @IsString({ message: 'Chi tiết sản phẩm phải là chuỗi' })
  description?: string;
  image?: string;
}

export class GetProductListQuery extends CommonListQuery {
  orderBy?: ProoductOrderBy;
}

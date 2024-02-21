import { IsNotEmpty, IsNumber } from "class-validator";
import { CommonListQuery } from "../../../common/interfaces";
import { ProoductOrderBy } from "./product.contant";
export class createProductDto{
    @IsNotEmpty({message:'Vui lòng nhập đầy đủ thông tin'})
    name?: string;
    price: number;
    quantity: number;
    description?: string;
    image?: string;
}
export class updateProductDto{
    name?: string;
    price?: number;
    quantity?: number;
    description?: string;
    image?: string;
}

export class GetProductListQuery extends CommonListQuery {
    orderBy?: ProoductOrderBy;
}
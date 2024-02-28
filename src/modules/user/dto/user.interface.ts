import { IsNotEmpty,IsOptional,IsString, Matches } from "class-validator";
import { CommonListQuery } from "../../../common/interfaces";
import { UserOrderBy } from "./user.constant";
const emailRegex =  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const phoneRegex = /^(((\+)84)|0)(3|5|7|8|9)([0-9]{3,13})/; 
export class createUserDto{
    // @IsNotEmpty({ message: 'Vui lòng nhập đầy đủ thông tin' })
    name: string;
    // @Matches(emailRegex, { message: 'Email không đúng định dạng' })
    // @IsNotEmpty({message:'Vui lòng nhập đầy đủ thông tin'})
    email: string;
    // @IsNotEmpty({ message: 'Vui lòng nhập đầy đủ thông tin' })
    password: string;
    birthday: string;
    // @Matches(phoneRegex, { message: 'Số điện thoại không đúng định dạng' })
    phone: string;
    role?: string;
    avatar?: string;
}

export class UpdateUserDto{
    name?: string;
    // @Matches(emailRegex, { message: 'Email không đúng định dạng' })
    email?: string;
    password?: string;
    birthday?: string;
    // @Matches(phoneRegex, { message: 'Số điện thoại không đúng định dạng' })
    phone?: string;
    role?: string;
    avatar?: string;
}

export class GetUserListQuery extends CommonListQuery {
    orderBy?: UserOrderBy;
}

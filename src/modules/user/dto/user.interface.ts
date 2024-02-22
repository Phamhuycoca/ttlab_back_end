import { IsNotEmpty,IsOptional,IsString, Matches } from "class-validator";
import { CommonListQuery } from "../../../common/interfaces";
import { UserOrderBy } from "./user.constant";
const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

export class createUserDto{
    @IsNotEmpty({ message: 'Vui lòng nhập đầy đủ thông tin' })
    name: string;
    @Matches(emailRegex, { message: 'Email không đúng định dạng' })
    @IsNotEmpty({message:'Vui lòng nhập đầy đủ thông tin'})
    email: string;
    @IsNotEmpty({ message: 'Vui lòng nhập đầy đủ thông tin' })
    password: string;
    birthday: string;
    phone: string;
    role?: string;
    avatar?: string;
}


export class UpdateUserDto{
    name?: string;
    email?: string;
    password?: string;
    birthday?: string;
    phone?: string;
    role?: string;
    avatar?: string;
}

export class GetUserListQuery extends CommonListQuery {
    orderBy?: UserOrderBy;
}

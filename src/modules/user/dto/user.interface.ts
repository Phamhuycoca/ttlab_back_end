import { IsDateString, IsNotEmpty,IsOptional,IsString, Matches,MaxLength,MinLength } from "class-validator";
import { CommonListQuery } from "../../../common/interfaces";
import { UserOrderBy } from "./user.constant";
import { IsValidDate } from "src/common/helper/pipe/IsValidDateConstraint";
const emailRegex =  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const passwordRegex = /^(?=.*[a-zA-z])(?=.*\d).{8,}$/;
const phoneRegex = /^(((\+)84)|0)(3|5|7|8|9)([0-9]{3,13})/; 
const nameRegex=/^[a-zA-ZÀ-Ỹà-ỹ ]*$/;

export class createUserDto{
    @IsNotEmpty({ message: 'Vui lòng nhập tên người dùng' })
    @Matches(nameRegex, { message: 'Tên người dùng không hợp lệ' })
    name: string;

    @IsNotEmpty({message:'Vui lòng nhập email'})
    @Matches(emailRegex, { message: 'Email không đúng định dạng' })
    email: string;
    
    @Matches(passwordRegex, { message: 'Mật khẩu phải có ít nhất 1 số hoặc chữ' })
    @MinLength(8, { message: 'Tối thiểu là 8 kí tự' })
    @MaxLength(30 ,{message: 'Mật khẩu không được quá 30 kí tự'})
    @IsNotEmpty({ message: 'Vui lòng nhập mật khẩu' })
    password: string;

    @IsValidDate({ message: 'Ngày sinh không được quá ngày hiện tại và phải ở định dạng (YYYY-MM-DD)'})
    @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'Ngày sinh không đúng định dạng (YYYY-MM-DD)' })
    @IsNotEmpty({message:'Vui lòng nhập ngày sinh'})
    birthday: string;

    @Matches(phoneRegex, { message: 'Số điện thoại không đúng định dạng' })
    phone: string;

    role?: string;

    avatar?: string;
}

export class UpdateUserDto{
    name?: string;
    @Matches(emailRegex, { message: 'Email không đúng định dạng' })
    email?: string;
    password?: string;
    @IsValidDate({ message: 'Ngày sinh không được quá ngày hiện tại và phải ở định dạng (YYYY-MM-DD)'})
    @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'Ngày sinh không đúng định dạng (YYYY-MM-DD)' })
    birthday?: string;
    @Matches(phoneRegex, { message: 'Số điện thoại không đúng định dạng' })
    phone?: string;
    role?: string;
    avatar?: string;
}

export class GetUserListQuery extends CommonListQuery {
    orderBy?: UserOrderBy;
}

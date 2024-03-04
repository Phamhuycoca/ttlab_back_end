import { IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";
// const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
const emailRegex =  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const passwordRegex = /^(?=.*[a-zA-z])(?=.*\d).{8,}$/;
const nameRegex=/^[a-zA-ZÀ-Ỹà-ỹ ]*$/;

export class LoginDto{
    @Matches(emailRegex, { message: 'Email không đúng định dạng' })
    @IsNotEmpty({message:'Vui lòng nhập email'})
    email: string;
    @Matches(passwordRegex, { message: 'Mật khẩu phải có ít nhất 1 số hoặc chữ' })
    @MinLength(8, { message: 'Tối thiểu là 8 kí tự' })
    @MaxLength(30 ,{message: 'Mật khẩu không được quá 30 kí tự'})
    @IsNotEmpty({ message: 'Vui lòng nhập mật khẩu' })
    password: string;
}
export class RegisterDto{
    @IsNotEmpty({ message: 'Vui lòng nhập tên người dùng' })
    @Matches(nameRegex, { message: 'Tên người dùng không hợp lệ' })
    name: string;
    @Matches(emailRegex, { message: 'Email không đúng định dạng' })
    @IsNotEmpty({message:'Vui lòng nhập email'})
    email: string;
    @Matches(passwordRegex, { message: 'Mật khẩu phải có ít nhất 1 số hoặc chữ' })
    @MinLength(8, { message: 'Tối thiểu là 8 kí tự' })
    @MaxLength(30 ,{message: 'Mật khẩu không được quá 30 kí tự'})
    @IsNotEmpty({ message: 'Vui lòng nhập mật khẩu' })
    password: string;
}
export class forgotPassword{
    @Matches(emailRegex, { message: 'Email không đúng định dạng' })
    @IsNotEmpty({message:'Vui lòng nhập đầy đủ thông tin'})
    email: string;
}
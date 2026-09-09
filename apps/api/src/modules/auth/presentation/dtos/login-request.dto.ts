import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from "class-validator";

export class LoginRequestDto {
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email!: string;

    @IsString()
    @IsNotEmpty()
    @IsStrongPassword()
    password!: string;
}
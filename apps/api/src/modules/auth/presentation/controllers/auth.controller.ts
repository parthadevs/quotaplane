import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { LoginRequestDto, RegisterRequestDto, RefreshRequestDto } from "../dtos";
import { LoginUseCase } from "../../application/use-cases/login-use-case";
import { RegisterUseCase } from "../../application/use-cases/register.use-case";
import { LogoutUseCase } from "../../application/use-cases/logout.use-case";
import { RefreshUseCase } from "../../application/use-cases/refresh.use-case";

@Controller("auth")
export class AuthController {

    constructor(
        private readonly loginUseCase : LoginUseCase,
        private readonly registerUseCase : RegisterUseCase,
        private readonly logoutUseCase : LogoutUseCase,
        private readonly refreshUseCase : RefreshUseCase
    ){}

    @Post("register")
    @HttpCode(HttpStatus.CREATED)
    async register(@Body() dto: RegisterRequestDto) {
        return this.registerUseCase.execute(dto)
    }

    @Post("login")
    @HttpCode(HttpStatus.OK)
    async login(@Body() dto: LoginRequestDto) {
        return this.loginUseCase.execute(dto)
    }

    @Post("refresh")
    @HttpCode(HttpStatus.OK)
    async refresh(@Body() dto: RefreshRequestDto) {
        return this.refreshUseCase.execute(dto)
    }

    @Post("logout")
    @HttpCode(HttpStatus.OK)
    async logout(@Body("token") token : string) {
        return this.logoutUseCase.execute(token)
    }
}
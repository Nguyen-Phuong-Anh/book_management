import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { LogInDto } from './dto/log-in.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('/register')
    async register(@Body() registerDto: RegisterDto) {
        const user = await this.authService.register(registerDto);
        return {
            data: [user]
        }
    }

    @Post('/login')
    async login(@Body() logInDto: LogInDto) {
        const access_token = await this.authService.login(logInDto)
        return {
            data: [{
                access_token: access_token
            }]
        }
    }
}

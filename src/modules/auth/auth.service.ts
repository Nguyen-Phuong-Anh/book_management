import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { User } from '../user/user.entity';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt'
import { LogInDto } from './dto/log-in.dto';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) { }

    async register(registerDto: RegisterDto) {
        const hashPwd = await bcrypt.hash(registerDto.password, 10)
        const existingUser = await this.userRepository.findOneBy({ email: registerDto.email }) || await this.userRepository.findOneBy({ username: registerDto.username })
        if (existingUser) {
            throw new BadRequestException('Email or Username already exists')
        }
        const user = this.userRepository.create({
            ...registerDto,
            password: hashPwd
        })
        try {
            return await this.userRepository.save(user)
        } catch (error) {
            throw new InternalServerErrorException('Failed to register new user')
        }
    }

    async login(logInDto: LogInDto) {
        const user = await this.userRepository.findOneBy({ username: logInDto.username })
        if (!user) {
            throw new UnauthorizedException()
        }

        if (await bcrypt.compare(logInDto.password, user.password)) {
            const payload = { sub: user.id, email: user.email, roles: user.roles }
            const access_token = await this.jwtService.signAsync(payload)
            return access_token
        }
    }
}

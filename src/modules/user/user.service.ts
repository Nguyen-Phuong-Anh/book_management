import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { QueryFailedError, Repository } from 'typeorm';
import { User } from './user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/common/enum/role.enum';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt'
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) { }

    async findProfile(userId: number) {
        const profile = await this.userRepository.findOneBy({ id: userId })
        const { password, roles, ...result } = profile
        return result
    }

    async updateProfile(id: number, updateProfileDto: UpdateProfileDto) {
        const user = await this.userRepository.findOneBy({ id })
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`)
        }

        if (updateProfileDto?.password) {
            const newPwd = await bcrypt.hash(updateProfileDto.password, 10)
            updateProfileDto.password = newPwd
        }

        Object.assign(user, updateProfileDto)
        try {
            return await this.userRepository.save(user)
        } catch (error) {
            if (error instanceof QueryFailedError) {
                throw new QueryFailedError(
                    'Duplicate entry error', undefined,
                    error.driverError,
                );
            } else {
                throw new InternalServerErrorException('Failed to update user')
            }
        }
    }

    async updateRoleToMember(id: number) {
        const user = await this.userRepository.findOneBy({ id })
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`)
        }

        user.roles.push(Role.Member)
        try {
            return await this.userRepository.save(user)
        } catch (error) {
            if (error instanceof QueryFailedError) {
                throw new QueryFailedError(
                    'Duplicate entry error', undefined,
                    error.driverError,
                );
            } else {
                throw new InternalServerErrorException('Failed to update user')
            }
        }
    }

    async createUser(createUserDto: CreateUserDto) {
        const hashPwd = await bcrypt.hash(createUserDto.password, 10)
        const existingUser = await this.userRepository.findOneBy({ email: createUserDto.email }) || await this.userRepository.findOneBy({ username: createUserDto.username })
        if (existingUser) {
            throw new BadRequestException('Email or Username already exists')
        }

        const user = this.userRepository.create({
            ...createUserDto,
            password: hashPwd
        })

        try {
            return await this.userRepository.save(user)
        } catch (error) {
            throw new InternalServerErrorException('Failed to create new user')
        }
    }

    async update(id: number, updateUserDto: UpdateUserDto) {
        const user = await this.userRepository.findOne({ where: { id } })
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`)
        }

        if (updateUserDto?.password) {
            const newPwd = await bcrypt.hash(updateUserDto.password, 10)
            updateUserDto.password = newPwd
        }
        Object.assign(user, updateUserDto)

        try {
            return await this.userRepository.save(user)
        } catch (error) {
            if (error instanceof QueryFailedError) {
                throw new QueryFailedError(
                    'Duplicate entry error', undefined,
                    error.driverError,
                );
            } else {
                throw new InternalServerErrorException('Failed to update user')
            }
        }
    }

    async delete(id: number) {
        const user = await this.userRepository.findOneBy({ id })
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`)
        }
        try {
            await this.userRepository.delete(id)
        } catch (error) {
            throw new InternalServerErrorException('Failed to delete user')
        }
    }
}

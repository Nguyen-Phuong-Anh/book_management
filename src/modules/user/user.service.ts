import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { QueryFailedError, Repository } from 'typeorm';
import { User } from './user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) { }

    async findProfile(userId: number) {
        const profile = await this.userRepository.findOneBy({ id: userId })
        const {password, roles, ...result} = profile
        return result
    }

    async updateProfile(id: number, updateProfileDto: UpdateProfileDto) {
        const user = await this.userRepository.findOneBy({ id })
        if(!user) {
            throw new NotFoundException(`User with ID ${id} not found`)
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
                throw new InternalServerErrorException('Failed to update book')
            }
        }
    }
}

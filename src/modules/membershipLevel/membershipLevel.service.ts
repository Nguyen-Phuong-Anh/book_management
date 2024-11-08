import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMembershipLevelDto } from './dto/create-membershipLevel.dto';
import { UpdateMembershipLevelDto } from './dto/update-membershipLevel.dto';
import { MembershipLevel } from './membershipLevel.entity';

@Injectable()
export class MembershipLevelService {
    constructor(
        @InjectRepository(MembershipLevel)
        private readonly membershipLevelRepository: Repository<MembershipLevel>
    ) { }

    async findAll(page: number, per_page: number) {
        try {
            const [membershipLevels, total] = await this.membershipLevelRepository.findAndCount({
                skip: (page - 1) * per_page,
                take: per_page
            })
            return { membershipLevels, total }
        } catch (error) {
            console.log(error)
            throw new InternalServerErrorException('Failed to retrieve membership levels')
        }
    }

    async findOneMembershipLevel(id: number) {
        const membershipLevel = await this.membershipLevelRepository.findOne({ where: { id } })
        if (!membershipLevel) {
            throw new NotFoundException(`Not found membership level with id ${id}`)
        }
        return membershipLevel;
    }

    async create(createMembershipLevelDto: CreateMembershipLevelDto) {
        const membershipLevel = this.membershipLevelRepository.create(createMembershipLevelDto)
        try {
            return await this.membershipLevelRepository.save(membershipLevel)
        } catch (error) {
            console.log(error)
            throw new InternalServerErrorException('Failed to create membership level')
        }
    }

    async update(id: number, updateMembershipLevelDto: UpdateMembershipLevelDto) {
        const membershipLevel = await this.membershipLevelRepository.findOne({ where: { id } })
        if (!membershipLevel) {
            throw new NotFoundException(`Not found membership with id ${id}`)
        }
        try {
            Object.assign(membershipLevel, updateMembershipLevelDto)
            return await this.membershipLevelRepository.save(membershipLevel)
        } catch (error) {
            throw new InternalServerErrorException('Failed to update membership level')
        }
    }

    async delete(id: number) {
        const membershipLevel = await this.membershipLevelRepository.findOne({ where: { id } })
        if (!membershipLevel) {
            throw new NotFoundException(`Not found membership level with id ${id}`)
        }
        try {
            await this.membershipLevelRepository.delete(id)
        } catch (error) {
            throw new InternalServerErrorException('Failed to delete membership level')
        }
    }
}

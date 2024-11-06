import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Membership } from './membership.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { UpdateMembershipDto } from './dto/update-membership.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MembershipStatus } from 'src/common/enum/membership-status.enum';

@Injectable()
export class MembershipService {
    constructor(
        @InjectRepository(Membership)
        private readonly membershipRepository: Repository<Membership>,
        private readonly dataSource: DataSource
    ) { }

    async findAll(page: number, per_page: number) {
        try {
            const [memberships, total] = await this.membershipRepository.findAndCount({
                skip: (page - 1) * per_page,
                take: per_page
            })
            return { memberships, total }
        } catch (error) {
            throw new InternalServerErrorException('Failed to retrieve memberships');
        }
    }

    async findOneMembership(id: number) {
        const membership = await this.membershipRepository.findOneBy({ id })
        if (!membership) {
            throw new NotFoundException(`Not found membership with id ${id}`)
        }
        return membership
    }

    async create(createMembershipDto: CreateMembershipDto) {
        const joinDate = new Date()
        joinDate.setHours(0, 0, 0, 0)
        const expirationDate = new Date(joinDate);
        expirationDate.setFullYear(expirationDate.getFullYear() + 1);
        expirationDate.setHours(0, 0, 0, 0)

        const membership = this.membershipRepository.create({
            ...createMembershipDto,
            joinDate: joinDate,
            expirationDate: expirationDate
        })
        try {
            return await this.membershipRepository.save(membership)
        } catch (error) {
            console.log(error)
            throw new InternalServerErrorException('Failed to create membership')
        }
    }

    async update(id: number, updatedMembershipDto: UpdateMembershipDto) {
        const membership = await this.membershipRepository.findOne({ where: { id } })
        if (!membership) {
            throw new NotFoundException(`Membership with ID ${id} not found`)
        }
        
        if(updatedMembershipDto?.renewalDate) {
            updatedMembershipDto.renewalDate.setHours(0, 0, 0, 0)
            const expirationDate = new Date(updatedMembershipDto.renewalDate)
            expirationDate.setFullYear(expirationDate.getFullYear() + 1);
            expirationDate.setHours(0, 0, 0, 0)

            try {
                Object.assign(membership, {
                    ...updatedMembershipDto,
                    expirationDate: expirationDate
                })
                return this.membershipRepository.save(membership)
            } catch (error) {
                throw new InternalServerErrorException('Failed to update membership')
            }
        }
        try {
            Object.assign(membership, updatedMembershipDto)
            return this.membershipRepository.save(membership)
        } catch (error) {
            throw new InternalServerErrorException('Failed to update membership')
        }
    }

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async updateExpiredMembership(): Promise<void> {
        const today = new Date();

        await this.dataSource
            .createQueryBuilder()
            .update(Membership)
            .set({ status: MembershipStatus.Inactive })
            .where("status = :status", { status: MembershipStatus.Active })
            .andWhere("expirationDate < :today", { today })
            .execute();
    }
}

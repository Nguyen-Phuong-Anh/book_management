import { Body, Controller, Get, Param, Post, Put, Query, SetMetadata, UseGuards } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { api_ver1 } from 'src/shared/constants';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { UpdateMembershipDto } from './dto/update-membership.dto';
import { MembershipService } from './membership.service';
import { Roles } from 'src/common/decorators/role.decorator';
import { Role } from 'src/common/enum/role.enum';
import { RoleGuard } from 'src/common/guard/role.guard';
import { UserService } from '../user/user.service';

@Controller('memberships')
export class MembershipController {
    constructor(
        private readonly reflector: Reflector,
        private readonly membershipService: MembershipService,
        private readonly userService: UserService
    ) { }

    @Roles(Role.Librarian, Role.Member)
    @UseGuards(RoleGuard)
    @SetMetadata('isCacheable', true)
    @Get('/:id')
    async findOneMembership(@Param('id') id: number) {
        const isCacheable = this.reflector.get<boolean>('isCacheable', MembershipController.prototype.findOneMembership);
        const membership = await this.membershipService.findOneMembership(id)
        return {
            data: [membership],
            isCacheable: isCacheable,
            type: 'membership',
        }
    }

    @Roles(Role.Librarian)
    @UseGuards(RoleGuard)
    @SetMetadata('isCacheable', true)
    @Get()
    async findAll(
        @Query('page') page: number = 1,
        @Query('per_page') per_page: number = 10
    ) {
        const isCacheable = this.reflector.get<boolean>('isCacheable', MembershipController.prototype.findAll);
        per_page = per_page > 100 ? 100 : per_page;
        const { memberships, total } = await this.membershipService.findAll(page, per_page)
        const totalPage = Math.ceil(total / per_page)
        return {
            data: memberships,
            meta: {
                page: page,
                per_page: per_page,
                page_count: totalPage,
                total: total,
                links: [
                    { self: `${api_ver1}/memberships?page=${page}&per_page=${per_page}` },
                    { first: `${api_ver1}/memberships?page=0&per_page=${per_page}` },
                    { previous: `${api_ver1}/memberships?page=${page - 1}&per_page=${per_page}` },
                    { next: `${api_ver1}/memberships?page=${page + 1}&per_page=${per_page}` },
                    { last: `${api_ver1}/memberships?page=${totalPage}&per_page=${per_page}` },

                ]
            },
            isCacheable: isCacheable,
            type: 'membership'
        }
    }

    @Roles(Role.User)
    @UseGuards(RoleGuard)
    @Post()
    async create(@Body() createMemberDto: CreateMembershipDto) {
        const membership = await this.membershipService.create(createMemberDto)
        await this.userService.updateRoleToMember(createMemberDto.userId);
        return {
            data: [membership],
            type: 'membership'
        }
    }

    @Roles(Role.Member)
    @UseGuards(RoleGuard)
    @Put('/:id')
    async update(@Param('id') id: number, @Body() updatedMembershipDto: UpdateMembershipDto) {
        const updatedMembership = await this.membershipService.update(id, updatedMembershipDto)
        return {
            data: [updatedMembership],
            type: 'membership'
        }
    }
}

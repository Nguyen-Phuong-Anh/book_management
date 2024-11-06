import { Body, Delete, Get, Param, ParseIntPipe, Post, Put, SetMetadata, UseGuards } from '@nestjs/common';
import { Controller, Query } from '@nestjs/common';
import { api_ver1 } from 'src/shared/constants';
import { CreateMembershipLevelDto } from './dto/create-membershipLevel.dto';
import { UpdateMembershipLevelDto } from './dto/update-membershipLevel.dto';
import { MembershipLevelService } from './membershipLevel.service';
import { Roles } from 'src/common/decorators/role.decorator';
import { Role } from 'src/common/enum/role.enum';
import { RoleGuard } from 'src/common/guard/role.guard';
import { Reflector } from '@nestjs/core';

@Controller('membership-levels')
export class MembershipLevelController {
    constructor(
        private readonly reflector: Reflector,
        private readonly membershipLevelService: MembershipLevelService
    ) { }

    @Roles(Role.Librarian)
    @UseGuards(RoleGuard)
    @SetMetadata('isCacheable', true)
    @Get('/:id')
    async findOneMembershipLevel(@Param('id', ParseIntPipe) id: number) {
        const isCacheable = this.reflector.get<boolean>('isCacheable', MembershipLevelController.prototype.findOneMembershipLevel);
        const membershipLevel = await this.membershipLevelService.findOneMembershipLevel(id)
        return {
            data: [membershipLevel],
            isCacheable: isCacheable,
            type: 'membership level'
        }
    }

    @Roles(Role.Librarian)
    @UseGuards(RoleGuard)
    @SetMetadata('isCacheable', true)
    @Get()
    async findAll(
        @Query('page') page: number = 1,
        @Query('per_page') per_page: number = 10,
    ) {
        const isCacheable = this.reflector.get<boolean>('isCacheable', MembershipLevelController.prototype.findAll);
        per_page = per_page > 100 ? 100 : per_page;
        const { membershipLevels, total } = await this.membershipLevelService.findAll(page, per_page)
        const totalPage = Math.ceil(total / per_page)
        return {
            data: membershipLevels,
            meta: {
                page: page,
                per_page: per_page,
                page_count: totalPage,
                total: total,
                links: [
                    { self: `${api_ver1}/membership-levels?page=${page}&per_page=${per_page}` },
                    { first: `${api_ver1}/membership-levels?page=0&per_page=${per_page}` },
                    { previous: `${api_ver1}/membership-levels?page=${page - 1}&per_page=${per_page}` },
                    { next: `${api_ver1}/membership-levels?page=${page + 1}&per_page=${per_page}` },
                    { last: `${api_ver1}/membership-levels?page=${totalPage}&per_page=${per_page}` },

                ]
            },
            isCacheable: isCacheable,
            type: 'membership level'
        }
    }

    @Roles(Role.Librarian)
    @UseGuards(RoleGuard)
    @Post()
    async create(@Body() createMembershipDto: CreateMembershipLevelDto) {
        const membershipLevel = await this.membershipLevelService.create(createMembershipDto)
        return {
            data: [membershipLevel],
            type: 'membership level'
        }
    }

    @Roles(Role.Librarian)
    @UseGuards(RoleGuard)
    @Put('/:id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() updateMembershipLevelDto: UpdateMembershipLevelDto) {
        const updateMembershipLevel = await this.membershipLevelService.update(id, updateMembershipLevelDto)
        return {
            data: [updateMembershipLevel],
            type: 'membership level'
        }
    }

    @Roles(Role.Librarian)
    @UseGuards(RoleGuard)
    @Delete('/:id')
    async delete(@Param('id', ParseIntPipe) id: number) {
        await this.membershipLevelService.delete(id)
        return {}
    }
}

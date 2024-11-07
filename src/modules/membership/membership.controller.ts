import { Body, Controller, Get, Param, Post, Put, Query, Req, SetMetadata, UseGuards } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { api_ver1 } from 'src/shared/constants';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { UpdateMembershipDto } from './dto/update-membership.dto';
import { MembershipService } from './membership.service';
import { Roles } from 'src/common/decorators/role.decorator';
import { Role } from 'src/common/enum/role.enum';
import { RoleGuard } from 'src/common/guards/role.guard';
import { UserService } from '../user/user.service';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@UseGuards(RoleGuard)
@Controller('memberships')
@ApiTags('membership')
export class MembershipController {
    constructor(
        private readonly reflector: Reflector,
        private readonly membershipService: MembershipService,
        private readonly userService: UserService
    ) { }

    @Roles(Role.Librarian, Role.Member)
    @SetMetadata('isCacheable', true)
    @Get('/:id')
    @ApiOperation({ summary: "Find a specific membership" })
    @ApiParam({ name: 'id', type: Number, description: 'the ID of the membership' })
    @ApiResponse({ status: 200, description: 'Membership returned successfully' })
    async findOneMembership(
        @Req() req: Request,
        @Param('id') id: number
    ) {
        const isCacheable = this.reflector.get<boolean>('isCacheable', MembershipController.prototype.findOneMembership);
        const membership = await this.membershipService.findOneMembership(req['user'].sub, req['user'].roles, id)
        const { membershipLevel, ...result} = membership
        result.relationships = {
            membershipLevel: membershipLevel
        }
        return {
            data: [result],
            isCacheable: isCacheable,
            type: 'membership',
        }
    }

    @Roles(Role.Librarian)
    @SetMetadata('isCacheable', true)
    @Get()
    @ApiOperation({ summary: "Find all memberships" })
    @ApiQuery({ name: 'page', type: Number, description: 'The current page', required: false })
    @ApiQuery({ name: 'per_page', type: Number, description: 'The page size', required: false })
    @ApiResponse({ status: 200, description: 'List of memberships returned successfully' })
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
                    { first: `${api_ver1}/books?page=1&per_page=${per_page}` },
                    { previous: `${api_ver1}/books?page=${page > 1 ? page - 1 : page}&per_page=${per_page}` },
                    { next: `${api_ver1}/books?page=${page + 1 <= totalPage ? page + 1 : totalPage}&per_page=${per_page}` },
                    { last: `${api_ver1}/memberships?page=${totalPage}&per_page=${per_page}` },

                ]
            },
            isCacheable: isCacheable,
            type: 'membership'
        }
    }

    @Roles(Role.User)
    @Post()
    @ApiOperation({ summary: "Create a new membership" })
    @ApiBody({ type: CreateMembershipDto })
    @ApiResponse({ status: 201, description: 'Created membership successfully' })
    async create(@Body() createMemberDto: CreateMembershipDto) {
        const membership = await this.membershipService.create(createMemberDto)
        await this.userService.updateRoleToMember(createMemberDto.userId);
        return {
            data: [membership],
            type: 'membership'
        }
    }

    @Roles(Role.Member)
    @Put('/:id')
    @ApiOperation({ summary: "Update a membership" })
    @ApiParam({ name: 'id', type: Number, description: 'Id of the membership' })
    @ApiBody({ type: UpdateMembershipDto })
    @ApiResponse({ status: 200, description: 'Update membership successfully' })
    async update(@Param('id') id: number, @Body() updatedMembershipDto: UpdateMembershipDto) {
        const updatedMembership = await this.membershipService.update(id, updatedMembershipDto)
        return {
            data: [updatedMembership],
            type: 'membership'
        }
    }
}

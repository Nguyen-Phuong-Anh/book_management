import { Body, Controller, Get, Param, Post, Query, Req, SetMetadata, UseGuards } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { MembershipPaymentService } from './membership-payment.service';
import { Role } from 'src/common/enum/role.enum';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { api_ver1 } from 'src/shared/constants';
import { CreateMembershipPaymentDto } from './dto/create-membership-payment.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth('access-token')
@UseGuards(RoleGuard)
@Controller('membership-payments')
@ApiTags('membership-payment')
export class MembershipPaymentController {
    constructor(
        private readonly reflector: Reflector,
        private readonly membershipPaymentService: MembershipPaymentService
    ) { }

    @Roles(Role.Librarian, Role.Member)
    @SetMetadata('isCacheable', true)
    @Get('/:id')
    @ApiOperation({ summary: "Find a specific membership payment" })
    @ApiParam({ name: 'id', type: Number, description: 'the ID of the membership payment' })
    @ApiResponse({ status: 200, description: 'Membership payment returned successfully' })
    async findOneMembershipPayment(
        @Req() req: Request,
        @Param('id') id: number
    ) {
        const isCacheable = this.reflector.get<boolean>('isCacheable', MembershipPaymentController.prototype.findOneMembershipPayment);
        const membershipPayment = await this.membershipPaymentService.findOneMembershipPayment(req['user'].sub, req['user'].roles, id)
        return {
            data: [membershipPayment],
            isCacheable: isCacheable,
            type: 'membership-payments'
        }
    }

    @Roles(Role.Librarian, Role.Member)
    @SetMetadata('isCacheable', true)
    @Get()
    @ApiOperation({ summary: "Find all membership payments" })
    @ApiQuery({ name: 'page', type: Number, description: 'The current page', required: false })
    @ApiQuery({ name: 'per_page', type: Number, description: 'The page size', required: false })
    @ApiResponse({ status: 200, description: 'List of membership payments returned successfully' })
    async findAll(
        @Req() req: Request,
        @Query('page') page: number = 1,
        @Query('per_page') per_page: number = 10
    ) {
        const isCacheable = this.reflector.get<boolean>('isCacheable', MembershipPaymentController.prototype.findAll);
        per_page = per_page > 100 ? 100 : per_page;
        const { membershipPayments, total } = await this.membershipPaymentService.findAll(req['user'].sub, req['user'].roles, page, per_page)
        const totalPage = Math.ceil(total / per_page)
        return {
            data: membershipPayments,
            meta: {
                page: page,
                per_page: per_page,
                page_count: totalPage,
                total: total,
                links: [
                    { self: `${api_ver1}/membership-payments?page=${page}&per_page=${per_page}` },
                    { first: `${api_ver1}/books?page=1&per_page=${per_page}` },
                    { previous: `${api_ver1}/books?page=${page > 1 ? page - 1 : page}&per_page=${per_page}` },
                    { next: `${api_ver1}/books?page=${page + 1 <= totalPage ? page + 1 : totalPage}&per_page=${per_page}` },
                    { last: `${api_ver1}/membership-payments?page=${totalPage}&per_page=${per_page}` },

                ]
            },
            isCacheable: isCacheable,
            type: 'membership-payments'
        }
    }

    @Roles(Role.Member)
    @Post()
    @ApiOperation({ summary: "Create a new membership payment" })
    @ApiBody({ type: CreateMembershipPaymentDto })
    @ApiResponse({ status: 201, description: 'Created membership payment successfully' })
    async create(
        @Body() createMembershipPaymentDto: CreateMembershipPaymentDto
    ) {
        const membershipPayment = await this.membershipPaymentService.create(createMembershipPaymentDto)
        return {
            data: [membershipPayment],
            type: 'membership-payments'
        }
    }
}

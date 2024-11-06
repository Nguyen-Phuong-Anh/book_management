import { Body, Controller, Get, Param, Post, Query, Req, SetMetadata, UseGuards } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { MembershipPaymentService } from './membership-payment.service';
import { Role } from 'src/common/enum/role.enum';
import { RoleGuard } from 'src/common/guard/role.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { api_ver1 } from 'src/shared/constants';
import { CreateMembershipPaymentDto } from './dto/create-membership-payment.dto';

@Controller('membership-payments')
export class MembershipPaymentController {
    constructor(
        private readonly reflector: Reflector,
        private readonly membershipPaymentService: MembershipPaymentService
    ) {}

    @Roles(Role.Librarian, Role.Member)
    @UseGuards(RoleGuard)
    @SetMetadata('isCacheable', true)
    @Get('/:id')
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
    @UseGuards(RoleGuard)
    @SetMetadata('isCacheable', true)
    @Get()
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
                    { first: `${api_ver1}/membership-payments?page=0&per_page=${per_page}` },
                    { previous: `${api_ver1}/membership-payments?page=${page - 1}&per_page=${per_page}` },
                    { next: `${api_ver1}/membership-payments?page=${page + 1}&per_page=${per_page}` },
                    { last: `${api_ver1}/membership-payments?page=${totalPage}&per_page=${per_page}` },

                ]
            },
            isCacheable: isCacheable,
            type: 'membership-payments'
        }
    }
    
    @Roles(Role.Member)
    @UseGuards(RoleGuard)
    @SetMetadata('isCacheable', false)
    @Post()
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

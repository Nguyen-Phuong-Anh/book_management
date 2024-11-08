import { Body, Controller, Get, Param, Post, Query, Req, SetMetadata, UseGuards } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RentalPaymentService } from './rental-payment.service';
import { api_ver1 } from 'src/shared/constants';
import { CreateRentalPaymentDto } from './dto/createRentalPaymentDto.dto';
import { Roles } from 'src/common/decorators/role.decorator';
import { Role } from 'src/common/enum/role.enum';
import { RoleGuard } from 'src/common/guards/role.guard';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth('access-token')
@Controller('rental-payments')
@UseGuards(RoleGuard)
@ApiTags('rental-payments')
export class RentalPaymentController {
    constructor(
        private readonly reflector: Reflector,
        private readonly rentalPaymentService: RentalPaymentService
    ) { }

    @Roles(Role.Librarian, Role.Member, Role.User)
    @SetMetadata('isCacheable', true)
    @Get('/:id')
    @ApiOperation({ summary: "Find rental payment with the given id" })
    @ApiParam({ name: 'id', type: Number, description: 'the ID of the rental payment' })
    @ApiResponse({ status: 200, description: 'Rental payment returned successfully' })
    async findOneRentalPayment(
        @Param('id') id: number
    ) {
        const isCacheable = this.reflector.get<boolean>('isCacheable', RentalPaymentController.prototype.findOneRentalPayment);
        const rental = await this.rentalPaymentService.findOneRentalPayment(id)
        return {
            data: [rental],
            isCacheable: isCacheable,
            type: 'rental-payments'
        }
    }

    @Roles(Role.Librarian)
    @SetMetadata('isCacheable', true)
    @Get()
    @ApiOperation({ summary: "Find all rental payments" })
    @ApiQuery({ name: 'page', type: Number, description: 'The current page', required: false })
    @ApiQuery({ name: 'per_page', type: Number, description: 'The page size', required: false })
    @ApiResponse({ status: 200, description: 'List of rental payments returned successfully' })
    async findAll(
        @Query('page') page: number = 1,
        @Query('per_page') per_page: number = 10
    ) {
        const isCacheable = this.reflector.get<boolean>('isCacheable', RentalPaymentController.prototype.findAll);
        per_page = per_page > 100 ? 100 : per_page;
        const { rentalPayments, total } = await this.rentalPaymentService.findAll(page, per_page)
        const totalPage = Math.ceil(total / per_page)
        return {
            data: rentalPayments,
            meta: {
                page: page,
                per_page: per_page,
                page_count: totalPage,
                total: total,
                links: [
                    { self: `${api_ver1}/rental-payments?page=${page}&per_page=${per_page}` },
                    { first: `${api_ver1}/books?page=1&per_page=${per_page}` },
                    { previous: `${api_ver1}/books?page=${page > 1 ? page - 1 : page}&per_page=${per_page}` },
                    { next: `${api_ver1}/books?page=${page + 1 <= totalPage ? page + 1 : totalPage}&per_page=${per_page}` },
                    { last: `${api_ver1}/rental-payments?page=${totalPage}&per_page=${per_page}` },

                ]
            },
            isCacheable: isCacheable,
            type: 'rental-payments'
        }
    }

    @Roles(Role.User, Role.Member)
    @Post()
    @ApiBody({ type: CreateRentalPaymentDto })
    @ApiOperation({ summary: "Create a new rental payment" })
    @ApiResponse({ status: 201, description: 'Created rental payment successfully' })
    async create(
        @Body() createRentalPaymentDto: CreateRentalPaymentDto,
    ) {
        const rentalPayment = await this.rentalPaymentService.create(createRentalPaymentDto)
        return {
            data: [rentalPayment]
        }
    }

}

import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RentalPaymentService } from './rental-payment.service';
import { api_ver1 } from 'src/shared/constants';
import { CreateRentalPaymentDto } from './dto/createRentalPaymentDto.dto';
import { UpdateRentalDto } from '../rental/dto/update-rental.dto';
import { RentalChargeDto } from '../rental/dto/rental-charge.dto';

@Controller('rental-payments')
export class RentalPaymentController {
    constructor(
        private readonly reflector: Reflector,
        private readonly rentalPaymentService: RentalPaymentService
    ) {}

    @Get('/:id')
    async findOneRental(@Param('id') id: number) {
        const rental = await this.rentalPaymentService.findOneRentalPayment(id)
        return {
            data: [rental]
        }
    }

    @Get()
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
                    { first: `${api_ver1}/rental-payments?page=0&per_page=${per_page}` },
                    { previous: `${api_ver1}/rental-payments?page=${page - 1}&per_page=${per_page}` },
                    { next: `${api_ver1}/rental-payments?page=${page + 1}&per_page=${per_page}` },
                    { last: `${api_ver1}/rental-payments?page=${totalPage}&per_page=${per_page}` },

                ]
            },
            isCacheable: isCacheable,
            type: 'rental-payments'
        }
    }

    @Post()
    async create(
        @Body() rentalChargeDto: RentalChargeDto,
        @Body() createRentalPaymentDto: CreateRentalPaymentDto,
    ) {
        const rentalPayment = await this.rentalPaymentService.create(rentalChargeDto, createRentalPaymentDto)
        return {
            data: [rentalPayment]
        }
    }
    
}

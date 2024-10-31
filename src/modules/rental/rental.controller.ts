import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { RentalService } from './rental.service';
import { CreateRentalDto } from './dto/create-rental.dto';
import { Reflector } from '@nestjs/core';
import { api_ver1 } from 'src/shared/constants';
import { UpdateRentalDto } from './dto/update-rental.dto';

@Controller('rentals')
export class RentalController {
    constructor(
        private readonly reflector: Reflector,
        private readonly rentalService: RentalService
    ) {}

    @Get('/:id')
    async findOneRental(@Param('id') id: number) {
        const rental = await this.rentalService.findOneRental(id)
        return {
            data: [rental]
        }
    }

    @Get()
    async findAll(
        @Query('page') page: number = 1,
        @Query('per_page') per_page: number = 10
    ) {
        const isCacheable = this.reflector.get<boolean>('isCacheable', RentalController.prototype.findAll);
        per_page = per_page > 100 ? 100 : per_page;
        const { rentals, total } = await this.rentalService.findAll(page, per_page)
        const totalPage = Math.ceil(total / per_page)
        return {
            data: rentals,
            meta: {
                page: page,
                per_page: per_page,
                page_count: totalPage,
                total: total,
                links: [
                    { self: `${api_ver1}/rentals?page=${page}&per_page=${per_page}` },
                    { first: `${api_ver1}/rentals?page=0&per_page=${per_page}` },
                    { previous: `${api_ver1}/rentals?page=${page - 1}&per_page=${per_page}` },
                    { next: `${api_ver1}/rentals?page=${page + 1}&per_page=${per_page}` },
                    { last: `${api_ver1}/rentals?page=${totalPage}&per_page=${per_page}` },

                ]
            },
            isCacheable: isCacheable,
            type: 'rentals'
        }
    }

    @Post()
    async create(
        @Body() discountRate: number,
        @Body() createRentalDto: CreateRentalDto
    ) {
        const rental = await this.rentalService.create(discountRate, createRentalDto)
        return {
            data: [rental]
        }
    }

    @Put('/:id')
    async update(@Param('id') id: number, @Body() updateRentalDto: UpdateRentalDto) {
        const updatedRental = await this.rentalService.update(id, updateRentalDto)
        return {
            data: [updatedRental]
        }
    }

    @Delete('/:id')
    async delete(@Param('id') id: number) {
        await this.rentalService.delete(id)
        return {}
    }
}

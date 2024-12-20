import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, SetMetadata, UseGuards } from '@nestjs/common';
import { RentalService } from './rental.service';
import { CreateRentalDto } from './dto/create-rental.dto';
import { Reflector } from '@nestjs/core';
import { api_ver1 } from 'src/shared/constants';
import { UpdateRentalDto } from './dto/update-rental.dto';
import { ApiOperation, ApiParam, ApiResponse, ApiQuery, ApiBody, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/role.decorator';
import { Role } from 'src/common/enum/role.enum';
import { RoleGuard } from 'src/common/guards/role.guard';

@Controller('rentals')
@UseGuards(RoleGuard)
@ApiTags('rental')
export class RentalController {
    constructor(
        private readonly reflector: Reflector,
        private readonly rentalService: RentalService
    ) { }

    @Roles(Role.Librarian, Role.User)
    @SetMetadata('isCacheable', true)
    @Get('/:id')
    @ApiOperation({ summary: "Find rental with the given id" })
    @ApiParam({ name: 'id', type: Number, description: 'the ID of the rental' })
    @ApiResponse({ status: 200, description: 'Rental returned successfully' })
    async findOneRental(
        @Param('id') id: number
    ) {
        const isCacheable = this.reflector.get<boolean>('isCacheable', RentalController.prototype.findOneRental);
        const rental = await this.rentalService.findOneRental(id)
        return {
            data: [rental],
            isCacheable: isCacheable,
            type: 'rentals'
        }
    }

    @Roles(Role.Librarian, Role.User)
    @SetMetadata('isCacheable', true)
    @Get()
    @ApiOperation({ summary: "Find all rentals" })
    @ApiQuery({ name: 'page', type: Number, description: 'The current page', required: false })
    @ApiQuery({ name: 'per_page', type: Number, description: 'The page size', required: false })
    @ApiResponse({ status: 200, description: 'List of rentals returned successfully' })
    async findAll(
        @Req() req: Request,
        @Query('page') page: number = 1,
        @Query('per_page') per_page: number = 10
    ) {
        const isCacheable = this.reflector.get<boolean>('isCacheable', RentalController.prototype.findAll);
        per_page = per_page > 100 ? 100 : per_page;
        const { rentals, total } = await this.rentalService.findAll(req['user'].sub, req['user'].roles, page, per_page)
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
                    { first: `${api_ver1}/books?page=1&per_page=${per_page}` },
                    { previous: `${api_ver1}/books?page=${page > 1 ? page - 1 : page}&per_page=${per_page}` },
                    { next: `${api_ver1}/books?page=${page + 1 <= totalPage ? page + 1 : totalPage}&per_page=${per_page}` },
                    { last: `${api_ver1}/rentals?page=${totalPage}&per_page=${per_page}` },

                ]
            },
            isCacheable: isCacheable,
            type: 'rentals'
        }
    }

    @Roles(Role.User)
    @Post()
    @ApiOperation({ summary: "Create a new rental" })
    @ApiBody({ type: CreateRentalDto })
    @ApiQuery({ name: 'discountRate', type: Number, description: 'The discount rate', required: true })
    @ApiResponse({ status: 201, description: 'Created rental successfully' })
    async create(
        @Req() req: Request,
        @Query('discount') discountRate: number = 10,
        @Body() createRentalDto: CreateRentalDto
    ) {
        const rental = await this.rentalService.create(req['user'].sub, discountRate, createRentalDto)
        return {
            data: [rental],
            type: 'rentals'
        }
    }

    @Roles(Role.User)
    @Put('/return/:id')
    @ApiOperation({ summary: "Return a rental" })
    @ApiResponse({ status: 200, description: 'Return rental successfully' })
    async return(@Param('id') id: number) {
        const returnRental = await this.rentalService.return(id)
        return {
            data: [returnRental],
            type: 'rentals'
        }
    }

    @Roles(Role.Librarian)
    @Put('/confirm/:id')
    @ApiOperation({ summary: "Confirm a rental" })
    @ApiParam({ name: 'id', type: Number, description: 'Id of the rental' })
    @ApiResponse({ status: 200, description: 'Confirm rental successfully' })
    async confirmRental(@Param('id') id: number) {
        const updatedRental = await this.rentalService.confirm(id)
        return {
            data: [updatedRental],
            type: 'rentals'
        }
    }

    @Roles(Role.User)
    @Put('/:id')
    @ApiOperation({ summary: "Update a rental" })
    @ApiParam({ name: 'id', type: Number, description: 'Id of the rental' })
    @ApiQuery({ name: 'discountRate', type: Number, description: 'The discount rate', required: true })
    @ApiBody({ type: UpdateRentalDto })
    @ApiResponse({ status: 200, description: 'Update rental successfully' })
    async update(
        @Param('id') id: number,
        @Query('discount') discountRate: number = 0,
        @Body() updateRentalDto: UpdateRentalDto
    ) {
        const updatedRental = await this.rentalService.update(id, discountRate, updateRentalDto)
        return {
            data: [updatedRental],
            type: 'rentals'
        }
    }

    @Roles(Role.User)
    @Delete('/:id')
    @ApiOperation({ summary: "Delete a rental" })
    @ApiParam({ name: 'id', type: Number, description: 'Id of the rental' })
    @ApiResponse({ status: 304, description: 'Delete rental successfully' })
    async delete(@Param('id') id: number) {
        await this.rentalService.delete(id)
        return {}
    }
}

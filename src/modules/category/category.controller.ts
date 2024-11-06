import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, Req, SetMetadata, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Role } from 'src/common/enum/role.enum';
import { Roles } from 'src/common/decorators/role.decorator';
import { api_ver1 } from 'src/shared/constants';
import { ApiOperation, ApiQuery, ApiResponse, ApiParam, ApiBody, ApiTags } from '@nestjs/swagger';
import { Reflector } from '@nestjs/core';

@Controller('categories')
@ApiTags('category')
export class CategoryController {
    constructor(
        private readonly reflector: Reflector,
        private readonly categoryService: CategoryService
    ) {}

    @SetMetadata('isCacheable', true)
    @Get()
    @ApiOperation({ summary: "Find all categories"})
    @ApiQuery({ name: 'page', type: Number, description: 'The current page', required: false})
    @ApiQuery({ name: 'per_page', type: Number, description: 'The page size', required: false})
    @ApiResponse({ status: 200, description: 'List of categories returned successfully'})
    async findAll(
        @Query('page') page: number = 1,
        @Query('per_page') per_page: number = 10,
    ) {
        const isCacheable = this.reflector.get<boolean>('isCacheable', CategoryController.prototype.findAll);
        const {categories, total} = await this.categoryService.findAll(page, per_page)
        const totalPage = Math.ceil(total / per_page)
        return {
            data: categories,
            meta: {
                page: page, 
                per_page: per_page,
                page_count: totalPage,
                total: total,
                links: [
                    {self: `${api_ver1}/categories?page=${page}&per_page=${per_page}`},
                    {first: `${api_ver1}/categories?page=0&per_page=${per_page}`},
                    {previous: `${api_ver1}/categories?page=${page-1}&per_page=${per_page}`},
                    {next: `${api_ver1}/categories?page=${page+1}&per_page=${per_page}`},
                    {last: `${api_ver1}/categories?page=${totalPage}&per_page=${per_page}`},
                    
                ]
            },
            isCacheable: isCacheable,
            type: 'categories'
        }    
    }

    @SetMetadata('isCacheable', true)
    @Get('/:id')
    @ApiOperation({ summary: "Find a specific category"})
    @ApiParam({ name: 'id', type: Number, description: 'the ID of the category'})
    @ApiResponse({ status: 200, description: 'Category returned successfully'})
    async findOneCategory(@Param('id', ParseIntPipe) id: number) {
        const isCacheable = this.reflector.get<boolean>('isCacheable', CategoryController.prototype.findOneCategory);
        const category = await this.categoryService.findOneCategory(id)
        return {
            data: [category],
            isCacheable: isCacheable,
            type: 'categories'
        }
    }

    @Roles(Role.Admin)
    @SetMetadata('isCacheable', false)
    @Post()
    @ApiOperation({ summary: "Create a new category"})
    @ApiBody({ type: CreateCategoryDto })
    @ApiResponse({ status: 201, description: 'Created category successfully'})
    async create(@Body() createCategoryDto: CreateCategoryDto) {
        const isCacheable = this.reflector.get<boolean>('isCacheable', CategoryController.prototype.create);
        const category = await this.categoryService.create(createCategoryDto)   
        return {
            data: category,
            isCacheable: isCacheable,
            type: 'categories'
        }
    }

    @Roles(Role.Admin)
    @SetMetadata('isCacheable', false)
    @Put('/:id')
    @ApiOperation({ summary: "Update a category"})
    @ApiParam({ name: 'id', type: Number, description: 'Id of the category'})
    @ApiBody({ type: UpdateCategoryDto })
    @ApiResponse({ status: 200, description: 'Update category successfully'})
    async update(@Param('id', ParseIntPipe) id: number, @Body() updateCategoryDto: UpdateCategoryDto) {
        const isCacheable = this.reflector.get<boolean>('isCacheable', CategoryController.prototype.update);
        const updatedCategory = await this.categoryService.update(id, updateCategoryDto)
        return {
            data: updatedCategory,
            isCacheable: isCacheable,
            type: 'categories'
        }
    }

    @Roles(Role.Admin)
    @Delete('/:id')
    @ApiOperation({ summary: "Delete a category"})
    @ApiParam({ name: 'id', type: Number, description: 'Id of the category'})
    @ApiResponse({ status: 304, description: 'Delete category successfully'})
    async delete(@Param('id', ParseIntPipe) id: number) {
        await this.categoryService.delete(id)
        return {}
    }
}

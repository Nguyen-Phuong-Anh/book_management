import { Body, Controller, Delete, Get, Param, Post, Put, Query, SetMetadata } from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Roles } from 'src/common/decorators/role.decorator';
import { Role } from 'src/common/enum/role.enum';
import { api_ver1 } from 'src/shared/constants';
import { Reflector } from '@nestjs/core';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('books')
@ApiTags('book')
export class BookController {
    constructor(
        private readonly reflector: Reflector,
        private readonly bookService: BookService
    ) { }

    @SetMetadata('isCacheable', true)
    @Get('/search')
    @ApiOperation({ summary: "Find book with title and author"})
    @ApiQuery({ name: 'title', type: String, description: 'Title of book', required: false})
    @ApiQuery({ name: 'author', type: String, description: 'Author of book', required: false})
    @ApiResponse({ status: 200, description: 'List of books returned successfully'})
    async searchBooks(@Query('title') title: string, @Query('author') author: string) {
        const { books, total } = await this.bookService.searchBooks(title, author)
        return {
            data: books,
            meta: {
                total: total
            }
        }
    }

    @SetMetadata('isCacheable', true)
    @Get('/:id')
    @ApiOperation({ summary: "Find a specific book"})
    @ApiParam({ name: 'id', type: Number, description: 'the ID of the book'})
    @ApiResponse({ status: 200, description: 'Book returned successfully'})
    async findOneBook(@Param('id') id: number) {
        const book = await this.bookService.findOneBook(id)
        return {
            data: book
        }
    }

    @SetMetadata('isCacheable', true)
    @Get()
    @ApiOperation({ summary: "Find all books"})
    @ApiQuery({ name: 'page', type: Number, description: 'The current page', required: false})
    @ApiQuery({ name: 'per_page', type: Number, description: 'The page size', required: false})
    @ApiResponse({ status: 200, description: 'List of books returned successfully'})
    async findAll(
        @Query('page') page: number = 1,
        @Query('per_page') per_page: number = 108
    ) {
        const isCacheable = this.reflector.get<boolean>('isCacheable', BookController.prototype.findAll);
        per_page = per_page > 100 ? 100 : per_page;
        const { books, total } = await this.bookService.findAll(page, per_page)
        const totalPage = Math.ceil(total / per_page)
        return {
            data: books,
            meta: {
                page: page,
                per_page: per_page,
                page_count: totalPage,
                total: total,
                links: [
                    { self: `${api_ver1}/books?page=${page}&per_page=${per_page}` },
                    { first: `${api_ver1}/books?page=0&per_page=${per_page}` },
                    { previous: `${api_ver1}/books?page=${page - 1}&per_page=${per_page}` },
                    { next: `${api_ver1}/books?page=${page + 1}&per_page=${per_page}` },
                    { last: `${api_ver1}/books?page=${totalPage}&per_page=${per_page}` },

                ]
            },
            isCacheable: isCacheable,
            type: 'books'
        }
    }

    
    @Roles(Role.Admin)
    @SetMetadata('isCacheable', false)
    @Post()
    @ApiOperation({ summary: "Create a new book"})
    @ApiBody({ type: CreateBookDto })
    @ApiResponse({ status: 201, description: 'Created book successfully'})
    async create(@Body() createBookDto: CreateBookDto) {
        const book = await this.bookService.create(createBookDto)
        return {
            data: [book]
        }
    }
    
    @Roles(Role.Admin)
    @SetMetadata('isCacheable', false)
    @Put('/:id')
    @ApiOperation({ summary: "Update a book"})
    @ApiParam({ name: 'id', type: Number, description: 'Id of the book'})
    @ApiBody({ type: UpdateBookDto })
    @ApiResponse({ status: 200, description: 'Update book successfully'})
    async update(@Param('id') id: number, @Body() updateBookDto: UpdateBookDto) {
        const updatedBook = await this.bookService.update(id, updateBookDto)
        return {
            data: updatedBook
        }
    }

    
    @Roles(Role.Admin)
    @SetMetadata('isCacheable', false)
    @Delete('/:id')
    @ApiOperation({ summary: "Delete a book"})
    @ApiParam({ name: 'id', type: Number, description: 'Id of the book'})
    @ApiResponse({ status: 304, description: 'Delete book successfully'})
    async delete(@Param('id') id: number) {
        await this.bookService.delete(id)
        return {}
    }
}

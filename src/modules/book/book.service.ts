import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Book } from './book.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BookService {
    constructor(
        @InjectRepository(Book)
        private readonly bookRepository: Repository<Book>
    ) { }

    async findAll(page: number, per_page: number) {
        try {
            const [books, total] = await this.bookRepository.findAndCount({
                skip: (page - 1) * per_page,
                take: per_page
            })
            return { books, total }
        } catch (error) {
            throw new InternalServerErrorException('Failed to retrieve books');
        }
    }

    async findOneBook(id: number): Promise<Book> {
        const book = await this.bookRepository.findOneBy({ id })
        if (!book) {
            throw new NotFoundException(`Not found book with id ${id}`)
        }
        return book
    }

    async searchBooks(title: string, author: string) {
        const [books, total] = await this.bookRepository
            .createQueryBuilder('book')
            .where('book.title LIKE :query', { query: `%${title}%` })
            .orWhere('book.author LIKE :query', { query: `%${author}%` })
            .getManyAndCount()
        if (books.length === 0) {
            throw new NotFoundException(`Not found book with given queries`)
        }
        return { books, total }
    }

    async create(createBookDto: CreateBookDto): Promise<Book> {
        const book = this.bookRepository.create(createBookDto)
        try {
            return await this.bookRepository.save(book)
        } catch (error) {
            throw new InternalServerErrorException('Failed to create book')
        }
    }

    async update(id: number, updateBookDto: UpdateBookDto): Promise<Book> {
        const book = await this.bookRepository.findOne({ where: { id } })
        if (!book) {
            throw new NotFoundException(`Book with ID ${id} not found`)
        }
        try {
            Object.assign(book, updateBookDto)
            return this.bookRepository.save(book)
        } catch (error) {
            throw new InternalServerErrorException('Failed to update book')
        }
    }

    async delete(id: number): Promise<void> {
        const book = await this.bookRepository.findOneBy({ id })
        if (!book) {
            throw new NotFoundException(`Book with ID ${id} not found`)
        }
        try {
            await this.bookRepository.delete(id)
        } catch (error) {
            throw new InternalServerErrorException('Failed to delete book')
        }
    }
}

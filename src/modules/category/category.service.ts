import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Category } from './category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>
    ) {}

    async findAll(page: number, per_page: number) {
        try {
            const [categories, total] = await this.categoryRepository.findAndCount({
                skip: (page - 1) * per_page,
                take: per_page
            })
            return { categories, total }
        } catch (error) {
            throw new InternalServerErrorException('Failed to retrieve categories')
        }
    }

    async findOneCategory(id: number): Promise<Category> {
        const category = await this.categoryRepository.findOne({ where: {id}})
        if(!category) {
            throw new NotFoundException(`Not found category with id ${id}`)
        }
        return category; 
    }

    async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
        const category = this.categoryRepository.create(createCategoryDto)
        try {
            return await this.categoryRepository.save(category)
        } catch (error) {
            throw new InternalServerErrorException('Failed to create category')
        }
    }

    async update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
        const category = await this.categoryRepository.findOne({ where: {id}})
        if(!category) {
            throw new NotFoundException(`Not found category with id ${id}`)
        }
        try {
            Object.assign(category, updateCategoryDto)
            return await this.categoryRepository.save(category)
        } catch (error) {
            throw new InternalServerErrorException('Failed to update category')
        }
    }

    async delete(id: number) {
        const category = await this.categoryRepository.findOne({ where: {id}})
        if(!category) {
            throw new NotFoundException(`Not found category with id ${id}`)
        }
        try {
            await this.categoryRepository.delete(id)
        } catch (error) {
            throw new InternalServerErrorException('Failed to delete category')
        }
    }
}

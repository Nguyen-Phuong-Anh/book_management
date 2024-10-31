import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Rental } from './rental.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateRentalDto } from './dto/create-rental.dto';
import { UpdateRentalDto } from './dto/update-rental.dto';
import { RentalStatus } from 'src/common/enum/rental-status.enum';
import { Book } from '../book/book.entity';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class RentalService {
    constructor(
        @InjectRepository(Rental)
        private readonly rentalRepository: Repository<Rental>,
        private readonly dataSource: DataSource
    ) { }

    async findAll(page: number, per_page: number) {
        try {
            const [rentals, total] = await this.rentalRepository.findAndCount({
                skip: (page - 1) * per_page,
                take: per_page
            })
            return { rentals, total }
        } catch (error) {
            throw new InternalServerErrorException('Failed to retrieve rentals');
        }
    }

    async findOneRental(id: number): Promise<Rental> {
        const rental = await this.rentalRepository.findOneBy({ id })
        if (!rental) {
            throw new NotFoundException(`Not found rental with id ${id}`)
        }
        return rental
    }

    async create(discountRate: number, createRentalDto: CreateRentalDto) {
        const currentDate = new Date()
        const creationDateMs = currentDate.getTime();
        const dueDateMs = createRentalDto.dueDate.getTime();
        const differenceMs = dueDateMs - creationDateMs;
        const days = Math.floor(differenceMs / (1000 * 60 * 60 * 24));

        let fee = 0
        if(days > 3) {
            fee = parseInt(process.env.RENTAL_FEE) * (days - 3)
        }

        const discountApplied = discountRate * fee

        const rental = this.rentalRepository.create({
            ...createRentalDto,
            creationDate: currentDate,
            fee: fee,
            discountApplied: discountApplied
        })        
        try {
            return await this.rentalRepository.save(rental)
        } catch (error) {
            throw new InternalServerErrorException('Failed to create rental')
        }
    }

    async update(id: number, updateRentalDto: UpdateRentalDto) {
        const rental = await this.rentalRepository.findOne({ where: { id } })
        if (!rental) {
            throw new NotFoundException(`Rental with ID ${id} not found`)
        }
        if(rental.status !== RentalStatus.Pending && (updateRentalDto?.dueDate || updateRentalDto?.returnDate)) {
            throw new Error('Warning: cannot modify the date if the status is not pending')
        }
        try {
            Object.assign(rental, updateRentalDto)
            return this.rentalRepository.save(rental)
        } catch (error) {
            throw new InternalServerErrorException('Failed to update rental')
        }
    }

    async delete(id: number): Promise<void> {
        const rental = await this.rentalRepository.findOneBy({ id })
        if (!rental) {
            throw new NotFoundException(`Rental with ID ${id} not found`)
        }
        try {
            await this.rentalRepository.delete(id)
            for (const bookItem of rental.books) {
                const result = await this.dataSource
                    .createQueryBuilder()
                    .update(Book)
                    .set({ quantity: () => `quantity + ${bookItem.quantity}` })
                    .where("id = :id", { id: bookItem.id })
                    .execute();

                if (result.affected === 0) {
                    throw new Error(`Book with id ${bookItem.id} not found or has insufficient quantity`);
                }
            }

        } catch (error) {
            throw new InternalServerErrorException('Failed to delete rental')
        }
    }

    @Cron(CronExpression.EVERY_30_SECONDS)
    async updateOverdueRentals(): Promise<void> {
        const today = new Date();
    
        await this.dataSource
            .createQueryBuilder()
            .update(Rental)
            .set({ status: RentalStatus.Overdue })
            .where("DATE_ADD(startDate, INTERVAL duration DAY) < :today", { today: today.toISOString() })
            .andWhere("status != :overdueStatus", { overdueStatus: RentalStatus.Overdue })
            .execute();
        
        console.log('updating...')
    }

    @Cron(CronExpression.EVERY_30_SECONDS)
    async updateOverdueFine(): Promise<void> {
        const finePerDay = process.env.FINE_PER_DAY;

        await this.dataSource
            .createQueryBuilder()
            .update(Rental)
            .set({
                fine: () => `DATEDIFF(returnDate, dueDate) * ${finePerDay}`
            })
            .where("overdueDate IS NOT NULL AND DATEDIFF(returnDate, dueDate) > 0")
            .execute();
    }
}

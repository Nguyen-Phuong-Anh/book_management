import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Rental } from './rental.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateRentalDto } from './dto/create-rental.dto';
import { UpdateRentalDto } from './dto/update-rental.dto';
import { RentalStatus } from 'src/common/enum/rental-status.enum';
import { Book } from '../book/book.entity';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Role } from 'src/common/enum/role.enum';

@Injectable()
export class RentalService {
    constructor(
        @InjectRepository(Rental)
        private readonly rentalRepository: Repository<Rental>,
        private readonly dataSource: DataSource
    ) { }

    async findAll(userId: number, roles: string[], page: number, per_page: number) {
        try {
            if(roles.includes(Role.Librarian)) {
                const [rentals, total] = await this.rentalRepository.findAndCount({
                    skip: (page - 1) * per_page,
                    take: per_page
                })
                return { rentals, total }
            } else {
                const [rentals, total] = await this.rentalRepository
                .findAndCount({
                    where: { userId },
                    skip: (page - 1) * per_page,
                    take: per_page
                })
                return { rentals, total }
            }
        } catch (error) {
            console.log(error)
            throw new InternalServerErrorException('Failed to retrieve rentals');
        }
    }

    async findOneRental(userId: number, roles: string[], id: number): Promise<Rental> {
        let rental;
        if(roles.includes(Role.Librarian)) {
            rental = await this.rentalRepository.findOne({ where: {id} })
        } else 
            rental = await this.rentalRepository.findOne({ where: {userId, id} })
        if (!rental) {
            throw new NotFoundException(`Not found rental with id ${id} or userId not matched`)
        }
        return rental
    }

    async create(discountRate: number, createRentalDto: CreateRentalDto) {
        const currentDate = new Date()
        const differenceMs = new Date(createRentalDto.dueDate).getTime() - currentDate.getTime();
        const days = Math.floor(differenceMs / (1000 * 60 * 60 * 24));

        let fee = 0
        if(days > 3) {
            fee = parseInt(process.env.RENTAL_FEE) * (days - 3)
        }

        const discountApplied = discountRate/100 * fee

        const rental = this.rentalRepository.create({
            ...createRentalDto,
            creationDate: currentDate,
            fee: fee,
            discountApplied: discountApplied
        })     
        
        try {
            await this.dataSource.transaction(async (transactionalEntityManager) => {
                for (const bookItem of rental.books) {
                    const result = await transactionalEntityManager
                        .createQueryBuilder()
                        .update(Book)
                        .set({ numberOfCopy: () => `numberOfCopy - ${bookItem.quantity}` })
                        .where("id = :id", { id: bookItem.id })
                        .execute();
    
                    if (result.affected === 0) {
                        throw new Error(`Book with id ${bookItem.id} not found or has insufficient quantity`);
                    }
                }
    
                await transactionalEntityManager.save(Rental, rental);
            });

            return rental;
        } catch (error) {
            throw new InternalServerErrorException(error)
        }
    }

    async update(id: number, updateRentalDto: UpdateRentalDto) {
        const rental = await this.rentalRepository.findOne({ where: { id } })
        if (!rental) {
            throw new NotFoundException(`Rental with ID ${id} not found`)
        }
        if(updateRentalDto?.dueDate && rental.status !== RentalStatus.Pending) {
            throw new Error('Warning: cannot modify the date if the status is not pending')
        }
        let fine = 0
        if(updateRentalDto?.returnDate) {
            const differenceMs = new Date(updateRentalDto.returnDate).getTime() - new Date(rental.dueDate).getTime();
            const days = Math.floor(differenceMs / (1000 * 60 * 60 * 24));
            fine = Number(process.env.FINE_PER_DAY) * days
        }
        try {
            Object.assign(rental, {
                ...updateRentalDto,
                fine: fine
            })
            return await this.rentalRepository.save(rental)
        } catch (error) {
            console.log(error)
            throw new InternalServerErrorException('Failed to update rental')
        }
    }

    async delete(id: number): Promise<void> {
        const rental = await this.rentalRepository.findOneBy({ id })
        if (!rental) {
            throw new NotFoundException(`Rental with ID ${id} not found`)
        }
        for (const bookItem of rental.books) {
            const result = await this.dataSource
                .createQueryBuilder()
                .update(Book)
                .set({ numberOfCopy: () => `numberOfCopy + ${bookItem.quantity}` })
                .where("id = :id", { id: bookItem.id })
                .execute();

            if (result.affected === 0) {
                throw new Error(`Book with id ${bookItem.id} not found or has insufficient quantity`);
            }
        }
        await this.rentalRepository.delete(id)
        
    }

    @Cron(CronExpression.EVERY_30_SECONDS)
    async updateOverdueRentals(): Promise<void> {
        await this.dataSource
            .createQueryBuilder()
            .update(Rental)
            .set({ status: RentalStatus.Overdue })
            .where("dueDate < :currentDate", { currentDate: new Date() })
            .andWhere("status != :overdueStatus", { overdueStatus: RentalStatus.Overdue })
            .execute();

        console.log('updating...')
    }

    // @Cron(CronExpression.EVERY_30_SECONDS)
    // async updateOverdueFine(): Promise<void> {
    //     const finePerDay = process.env.FINE_PER_DAY;

    //     await this.dataSource
    //         .createQueryBuilder()
    //         .update(Rental)
    //         .set({
    //             fine: () => `EXTRACT(DAY FROM (returnDate - dueDate)) * ${finePerDay}`
    //         })
    //         .where("dueDate IS NOT NULL AND (returnDate - dueDate) > INTERVAL '0 days'")
    //         .execute();
        
    //     console.log('update fine...')
    // }
}

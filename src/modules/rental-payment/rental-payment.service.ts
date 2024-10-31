import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RentalPayment } from './rental-payment.entity';
import { Repository } from 'typeorm';
import { CreateRentalPaymentDto } from './dto/createRentalPaymentDto.dto';
import { RentalChargeDto } from '../rental/dto/rental-charge.dto';

@Injectable()
export class RentalPaymentService {
    constructor(
        @InjectRepository(RentalPayment)
        private readonly rentalPaymentRepository: Repository<RentalPayment>
    ) { }
    
    async findAll(page: number, per_page: number) {
        try {
            const [rentalPayments, total] = await this.rentalPaymentRepository.findAndCount({
                skip: (page - 1) * per_page,
                take: per_page
            })
            return { rentalPayments, total }
        } catch (error) {
            throw new InternalServerErrorException('Failed to retrieve rental payments');
        }
    }

    async findOneRentalPayment(id: number) {
        const rental = await this.rentalPaymentRepository.findOneBy({ id })
        if (!rental) {
            throw new NotFoundException(`Not found rental payment with id ${id}`)
        }
        return rental
    }

    async create(rentalChargeDto: RentalChargeDto, createRentalPaymentDto: CreateRentalPaymentDto) {
        const paymentDate = new Date()
        const amount = (rentalChargeDto.fee - rentalChargeDto.discountApplied) + rentalChargeDto.fine
        const rental = this.rentalPaymentRepository.create({
            ...createRentalPaymentDto,
            paymentDate: paymentDate,
            amount: amount
        })
        try {
            return await this.rentalPaymentRepository.save(rental)
        } catch (error) {
            throw new InternalServerErrorException('Failed to create rental payment')
        }
    }
}

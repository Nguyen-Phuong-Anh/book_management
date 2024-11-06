import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MembershipPayment } from './membership-payment.entity';
import { Repository } from 'typeorm';
import { Role } from 'src/common/enum/role.enum';
import { CreateMembershipPaymentDto } from './dto/create-membership-payment.dto';

@Injectable()
export class MembershipPaymentService {
    constructor(
        @InjectRepository(MembershipPayment)
        private membershipPaymentRepository: Repository<MembershipPayment>,
    ) {}

    async findOneMembershipPayment(membershipId: number, roles: string[], id: number) {
        let membershipPayment;
        if(roles.includes(Role.Librarian)) {
            membershipPayment = await this.membershipPaymentRepository.findOne({ where: {id} })
        } else 
            membershipPayment = await this.membershipPaymentRepository.findOne({ where: {membershipId, id} })
        if (!membershipPayment) {
            throw new NotFoundException(`Not found membership payment with id ${id} or membershipId not matched`)
        }
        return membershipPayment
    }

    async findAll(membershipId: number, roles: string[], page: number, per_page: number) {
        try {
            if(roles.includes(Role.Librarian)) {
                const [membershipPayments, total] = await this.membershipPaymentRepository.findAndCount({
                    skip: (page - 1) * per_page,
                    take: per_page
                })
                return { membershipPayments, total }
            } else {
                const [membershipPayments, total] = await this.membershipPaymentRepository
                .findAndCount({
                    where: { membershipId },
                    skip: (page - 1) * per_page,
                    take: per_page
                })
                return { membershipPayments, total }
            }
        } catch (error) {
            console.log(error)
            throw new InternalServerErrorException('Failed to retrieve membership payments');
        }
    }

    async create(createMembershipPaymentDto: CreateMembershipPaymentDto) {
        const paymentDate = new Date()
        
        const membershipPayment = this.membershipPaymentRepository.create({
            ...createMembershipPaymentDto,
            paymentDate: paymentDate
        })

        try {
            return await this.membershipPaymentRepository.save(membershipPayment)
        } catch (error) {
            console.log(error)
            throw new InternalServerErrorException('Failed to create membership payment')
        }
    }
}

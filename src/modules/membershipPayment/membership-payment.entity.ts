import { PaymentStatus } from "src/common/enum/payment-status.enum";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Membership } from "../membership/membership.entity";

@Entity()
export class MembershipPayment {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    membershipId: number

    @Column({ nullable: false })
    paymentDate: Date

    @Column({
        type: 'real',
        default: 0
    })
    amount: number
    
    @Column({ nullable: true })
    description?: string;

    @Column({
        type: 'enum',
        enum: PaymentStatus,
        default: PaymentStatus.Paid
    })
    status: string

    @ManyToOne(() => Membership, (membership) => membership.id)
    @JoinColumn({ name: 'membershipId'})
    membership: Membership
}
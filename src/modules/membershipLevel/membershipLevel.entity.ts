import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class MembershipLevel {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    level: string

    @Column({ type: 'float'})
    discountRate: number

    @Column({ type: 'real' })
    annualFee: number
}
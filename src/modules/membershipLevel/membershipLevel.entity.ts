import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Membership } from "../membership/membership.entity";

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

    @OneToMany(() => Membership, (membership) => membership.membershipLevel)
    memberships: Membership[]
}
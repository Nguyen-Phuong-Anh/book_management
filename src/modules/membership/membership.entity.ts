import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../user/user.entity";
import { MembershipStatus } from "src/common/enum/membership-status.enum";
import { MembershipLevel } from "../membershipLevel/membershipLevel.entity";

@Entity()
export class Membership {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    userId: number

    @Column({ nullable: false })
    joinDate: Date

    @Column({
        type: 'enum',
        enum: MembershipStatus,
        default: MembershipStatus.Active
    })
    status: string

    @Column({ nullable: true })
    renewalDate: Date

    @Column({ nullable: true })
    expirationDate: Date

    @Column()
    membershipLevelID: number

    @OneToOne(() => User, (user) => user.id)
    @JoinColumn({ name: 'userId' })
    user: User

    @ManyToOne(() => MembershipLevel, (membershipLevel) => membershipLevel.memberships)
    @JoinColumn({ name: 'membershipLevelID'})
    membershipLevel: MembershipLevel
}
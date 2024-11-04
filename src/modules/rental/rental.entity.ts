import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { BookItem } from "../book/book-item.entity";
import { RentalStatus } from "src/common/enum/rental-status.enum";
import { User } from "../user/user.entity";

@Entity()
export class Rental {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    userId: number

    @Column({ type: 'jsonb', nullable: false})
    books: BookItem[]

    @Column()
    creationDate: Date

    @Column()
    dueDate: Date

    @Column({ nullable: true })
    returnDate: Date

    @Column({
        type: "enum",
        enum: RentalStatus,
        default: RentalStatus.Pending
    })
    status: RentalStatus

    @Column({
        type: 'real',
        default: 0
    })
    fee: number

    @Column({
        type: 'real',
        default: 0
    })
    discountApplied: number
    
    @Column({
        type: 'real',
        default: 0
    })
    fine: number

    @ManyToOne(() => User, (user) => user.id)
    @JoinColumn({ name: 'userId' })
    user: User
}
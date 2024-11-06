import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../user/user.entity";
import { Rental } from "../rental/rental.entity";

@Entity()
export class RentalPayment {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    librarianId: number

    @Column()
    rentalId: number

    @Column()
    paymentDate: Date

    @Column({
        type: 'real'
    })
    amount: number

    @ManyToOne(() => User, user => user.id)
    @JoinColumn({ name: 'librarianId'})
    librarian: User

    @OneToOne(() => Rental, rental => rental.id)
    @JoinColumn({ name: 'rentalId'})
    rental: Rental
}
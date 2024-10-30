import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Book } from "../book/book.entity";
import { timestamp } from "rxjs";

@Entity()
export class Category {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: "varchar", length: 100, nullable: false})
    name: string

    @Column({ type: "varchar", length: 200, nullable: false})
    description: string

    @OneToMany(() => Book, (book) => book.categoryId)
    books: Book[]
}
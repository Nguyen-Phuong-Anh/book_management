import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Category } from "../category/category.entity";

@Entity()
export class Book {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: "varchar", length: 200, nullable: false})
    title: string

    @Column({ type: "varchar", length: 100, nullable: false})
    author: string

    @Column({ type: "varchar", length: 50, nullable: false})
    isbn: string

    @Column()
    publishedDate: Date

    @Column()
    categoryId: number

    @ManyToOne(() => Category, (category) => category.books, { cascade: true})
    @JoinColumn({ name: 'categoryId'})
    category: Category
}
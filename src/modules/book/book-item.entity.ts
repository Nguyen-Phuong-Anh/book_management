import { Column } from "typeorm";

export class BookItem {
    @Column()
    id: number

    @Column()
    quantity: number
}
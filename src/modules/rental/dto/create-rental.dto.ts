import { IsDateString, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { RentalStatus } from "src/common/enum/rental-status.enum";
import { BookItem } from "src/modules/book/book-item.entity";

export class CreateRentalDto {
    @IsNumber()
    @IsNotEmpty()
    userId: number

    @IsNotEmpty()
    books: BookItem[]

    @IsDateString()
    @IsNotEmpty()
    dueDate: Date

    @IsNotEmpty()
    @IsString()
    status: RentalStatus
}
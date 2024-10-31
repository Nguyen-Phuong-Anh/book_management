import { IsDateString, IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";
import { RentalStatus } from "src/common/enum/rental-status.enum";
import { BookItem } from "src/modules/book/book-item.entity";

export class CreateRentalDto {
    @IsString()
    @IsNotEmpty()
    userId: number

    @IsNotEmpty()
    books: BookItem[]

    @IsDateString()
    @IsNotEmpty()
    dueDate: Date

    @IsDateString()
    @IsNotEmpty()
    returnDate: Date

    @IsNotEmpty()
    @IsString()
    status: RentalStatus
}
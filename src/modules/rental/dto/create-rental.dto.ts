import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { RentalStatus } from "src/common/enum/rental-status.enum";
import { BookItem } from "src/modules/book/book-item.entity";

export class CreateRentalDto {
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({type: Number, description: 'The user id of the rental'})
    userId: number

    @IsNotEmpty()
    @ApiProperty({type: BookItem, isArray: true, description: 'The array of books rent'})
    books: BookItem[]

    @IsDateString()
    @IsNotEmpty()
    @ApiProperty({type: Date, description: 'The due date of the rental'})
    dueDate: Date

    @IsNotEmpty()
    @IsString()
    @ApiProperty({enum: RentalStatus, description: 'The status of the rental'})
    status: RentalStatus
}
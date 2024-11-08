import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsOptional } from "class-validator";
import { BookItem } from "src/modules/book/book-item.entity";

export class UpdateRentalDto {
    @IsDateString()
    @IsOptional()
    @ApiProperty({type: Date, description: 'The due date of the rental'})
    dueDate: Date

    @IsOptional()
    @ApiProperty({type: BookItem, isArray: true, description: 'The array of books rent'})
    books: BookItem[]
}
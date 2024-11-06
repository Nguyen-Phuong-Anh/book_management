import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsOptional, IsString } from "class-validator";
import { RentalStatus } from "src/common/enum/rental-status.enum";
import { BookItem } from "src/modules/book/book-item.entity";

export class UpdateRentalDto {
    @IsDateString()
    @IsOptional()
    @ApiProperty({type: Date, description: 'The due date of the rental'})
    dueDate: Date

    @IsOptional()
    @ApiProperty({type: BookItem, isArray: true, description: 'The array of books rent'})
    books: BookItem[]

    @IsDateString()
    @IsOptional()
    @ApiProperty({type: Date, description: 'The return date of the rental'})
    returnDate: Date

    @IsOptional()
    @IsString()
    @ApiProperty({enum: RentalStatus, description: 'The status of the rental'})
    status: RentalStatus
}
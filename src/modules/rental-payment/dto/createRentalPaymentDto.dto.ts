import { IsDateString, IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator"

export class CreateRentalPaymentDto {
    @IsString()
    @IsNotEmpty()
    librarianId: number

    @IsString()
    @IsNotEmpty()
    rentalId: number
}
import { IsNotEmpty, IsNumber, IsPositive } from "class-validator"

export class CreateRentalPaymentDto {
    @IsNumber()
    @IsNotEmpty()
    librarianId: number

    @IsNumber()
    @IsNotEmpty()
    rentalId: number

    @IsNumber()
    fee: number

    @IsNumber()
    discountApplied: number

    @IsNumber()
    @IsPositive()
    fine: number
}
import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsNumber, IsPositive } from "class-validator"

export class CreateRentalPaymentDto {
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({type: Number, description: 'The rental id of the rental payment'})
    rentalId: number

    @IsNumber()
    @ApiProperty({type: Number, description: 'The fee of the rental payment'})
    fee: number

    @IsNumber()
    @ApiProperty({type: Number, description: 'The discount applied of the rental payment'})
    discountApplied: number

    @IsNumber()
    @IsPositive()
    @ApiProperty({type: Number, description: 'The fine of the rental payment'})
    fine: number
}
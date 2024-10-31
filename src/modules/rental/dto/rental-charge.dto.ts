import { IsNumber } from "@nestjs/class-validator"
import { IsPositive } from "class-validator"

export class RentalChargeDto {
    @IsNumber()
    @IsPositive()
    fee: number

    @IsNumber()
    @IsPositive()
    discountApplied: number

    @IsNumber()
    @IsPositive()
    fine: number
}
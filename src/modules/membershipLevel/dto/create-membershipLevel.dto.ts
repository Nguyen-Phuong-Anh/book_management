import { IsString } from "@nestjs/class-validator"
import { IsNumber, IsPositive } from "class-validator"

export class CreateMembershipLevelDto {
    @IsString()
    level: string

    @IsNumber()
    @IsPositive()
    discountRate: number

    @IsNumber()
    @IsPositive()
    annualFee: number
}
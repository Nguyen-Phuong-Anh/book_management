import { IsNumber, IsOptional, IsPositive, IsString } from "class-validator"

export class UpdateMembershipLevelDto {
    @IsString()
    @IsOptional()
    level: string

    @IsNumber()
    @IsPositive()
    @IsOptional()
    discountRate: number

    @IsNumber()
    @IsPositive()
    @IsOptional()
    annualFee: number
}
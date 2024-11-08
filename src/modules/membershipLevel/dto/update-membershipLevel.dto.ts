import { ApiProperty } from "@nestjs/swagger"
import { IsNumber, IsOptional, IsPositive, IsString } from "class-validator"

export class UpdateMembershipLevelDto {
    @IsString()
    @IsOptional()
    @ApiProperty({type: String, description: 'The level of the membership level'})
    level: string

    @IsNumber()
    @IsPositive()
    @IsOptional()
    @ApiProperty({type: Number, description: 'The discount rate of membership level'})
    discountRate: number

    @IsNumber()
    @IsPositive()
    @IsOptional()
    @ApiProperty({type: Number, description: 'The annual fee of membership level'})
    annualFee: number
}
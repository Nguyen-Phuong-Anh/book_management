import { IsString } from "@nestjs/class-validator"
import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsNumber, IsPositive } from "class-validator"

export class CreateMembershipLevelDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({type: String, description: 'The level of membership'})
    level: string

    @IsNumber()
    @IsPositive()
    @ApiProperty({type: Number, description: 'The discount rate of membership'})
    discountRate: number

    @IsNumber()
    @IsPositive()
    @ApiProperty({type: Number, description: 'The annual fee of membership'})
    annualFee: number
}
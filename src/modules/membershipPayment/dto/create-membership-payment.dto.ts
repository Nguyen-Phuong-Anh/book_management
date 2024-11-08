import { IsNotEmpty, IsString } from "@nestjs/class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsPositive } from "class-validator";

export class CreateMembershipPaymentDto {
    @IsNumber()
    @ApiProperty({type: String, description: 'The id of the membership'})
    membershipId: number

    @IsNumber()
    @IsPositive()
    @ApiProperty({type: Number, description: 'The amount of membership payment'})
    amount: number
    
    @IsString()
    @IsOptional()
    @IsNotEmpty()
    @ApiProperty({type: String, description: 'The description of the membership payment'})
    description?: string;
}
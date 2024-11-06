import { IsString } from "@nestjs/class-validator";
import { IsNumber, IsOptional, IsPositive } from "class-validator";

export class CreateMembershipPaymentDto {
    @IsNumber()
    membershipId: number

    @IsNumber()
    @IsPositive()
    amount: number
    
    @IsString()
    @IsOptional()
    description?: string;
}
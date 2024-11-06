import { IsNumber } from "@nestjs/class-validator"
import { IsDateString, IsOptional, IsString } from "class-validator"

export class UpdateMembershipDto {
    @IsString()
    @IsOptional()
    status: string
    
    @IsDateString()
    @IsOptional()
    renewalDate: Date

    @IsNumber()
    @IsOptional()
    membershipLevelID: number
}
import { IsNumber } from "@nestjs/class-validator"
import { ApiProperty } from "@nestjs/swagger"
import { IsDateString, IsOptional, IsString } from "class-validator"

export class UpdateMembershipDto {
    @IsString()
    @IsOptional()
    @ApiProperty({type: String, description: 'Status of the membership'})
    status: string
    
    @IsDateString()
    @IsOptional()
    @ApiProperty({type: Date, description: 'Renewal date of the membership'})
    renewalDate: Date

    @IsNumber()
    @IsOptional()
    @ApiProperty({type: Number, description: 'The membership level id of the membership'})
    membershipLevelID: number
}
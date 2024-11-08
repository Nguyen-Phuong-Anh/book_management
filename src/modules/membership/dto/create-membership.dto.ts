import { IsNumber, IsPositive } from "@nestjs/class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class CreateMembershipDto {
    @IsNumber()
    @IsPositive()
    @ApiProperty({type: Number, description: 'The user id of the membership'})
    userId: number
    
    @IsNumber()
    @ApiProperty({type: Number, description: 'The membership level id of the membership'})
    membershipLevelID: number
}
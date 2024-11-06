import { IsNumber } from "@nestjs/class-validator"

export class CreateMembershipDto {
    @IsNumber()
    userId: number
    
    @IsNumber()
    membershipLevelID: number
}
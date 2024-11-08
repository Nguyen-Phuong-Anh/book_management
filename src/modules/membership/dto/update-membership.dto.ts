import { IsNumber } from "@nestjs/class-validator"
import { ApiProperty } from "@nestjs/swagger"
import { IsOptional, IsString } from "class-validator"
import { MembershipStatus } from "src/common/enum/membership-status.enum"

export class UpdateMembershipDto {
    @IsString()
    @IsOptional()
    @ApiProperty({enum: MembershipStatus, description: 'Status of the membership'})
    status: MembershipStatus

    @IsNumber()
    @IsOptional()
    @ApiProperty({type: Number, description: 'The membership level id of the membership'})
    membershipLevelID: number
}
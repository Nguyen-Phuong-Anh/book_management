import { ApiProperty } from "@nestjs/swagger"
import { IsOptional, IsString } from "class-validator"
import { RentalStatus } from "src/common/enum/rental-status.enum"

export class ReturnRentalDto {
    @IsOptional()
    @IsString()
    @ApiProperty({enum: RentalStatus, description: 'The status of the rental'})
    status: RentalStatus
}
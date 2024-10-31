import { IsDateString, IsOptional, IsString } from "class-validator";
import { RentalStatus } from "src/common/enum/rental-status.enum";

export class UpdateRentalDto {
    @IsDateString()
    @IsOptional()
    dueDate: Date

    @IsDateString()
    @IsOptional()
    returnDate: Date

    @IsOptional()
    @IsString()
    status: RentalStatus
}
import { IsOptional, IsString } from "@nestjs/class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class UpdateCategoryDto {
    @IsString()
    @IsOptional()
    @ApiProperty({type: String, description: 'Name of the book'})
    name?: string

    @IsString()
    @IsOptional()
    @ApiProperty({type: String, description: 'Description of the book'})
    description?: string
}
import { IsString } from "@nestjs/class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class CreateCategoryDto {
    @IsString()
    @ApiProperty({type: String, description: 'Name of the book'})
    name: string

    @IsString()
    @ApiProperty({type: String, description: 'Description of the book'})
    description: string
}
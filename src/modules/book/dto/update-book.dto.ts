import { IsNumber, IsOptional, IsString } from "@nestjs/class-validator"
import { ApiProperty } from "@nestjs/swagger"
import { IsDateString, IsPositive } from "class-validator"

export class UpdateBookDto {
    @IsString()
    @IsOptional()
    @ApiProperty({type: String, description: 'Title of the book'})
    title?: string

    @IsString()
    @IsOptional()
    @ApiProperty({type: String, description: 'Author of the book'})
    author?: string

    @IsString()
    @IsOptional()
    @ApiProperty({type: String, description: 'ISBN of the book'})
    isbn?: string

    @IsDateString()
    @IsOptional()
    @ApiProperty({type: Date, description: 'The published date of the book'})
    publishedDate?: Date

    @IsNumber()
    @IsPositive()
    @IsOptional()
    @ApiProperty({type: Number, description: 'The category id of the book'})
    categoryId?: number
}
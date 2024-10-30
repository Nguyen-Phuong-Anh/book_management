import { IsNumber, IsString } from "@nestjs/class-validator"
import { ApiProperty } from "@nestjs/swagger"
import { IsDateString, IsNotEmpty, isNotEmpty, IsPositive } from "class-validator"

export class CreateBookDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({type: String, description: 'Title of the book'})
    title: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty({type: String, description: 'Author of the book'})
    author: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty({type: String, description: 'ISBN of the book'})
    isbn: string

    @IsDateString()
    @IsNotEmpty()
    @ApiProperty({type: Date, description: 'The published date of the book'})
    publishedDate: Date

    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    @ApiProperty({type: Number, description: 'The category id of the book'})
    categoryId: number
}
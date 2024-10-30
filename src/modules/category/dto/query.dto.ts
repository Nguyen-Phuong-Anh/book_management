import { IsOptional, IsString } from "@nestjs/class-validator";

export class QueryDto {
    @IsString()
    @IsOptional()
    title?: string

    @IsString()
    @IsOptional()
    author?: string
}
import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString } from "class-validator"

export class LogInDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({type: String, description: 'Username of the user'})
    username: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ type: String, description: 'Password of the user' })
    password: string
}
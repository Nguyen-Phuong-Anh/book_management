import { IsEmail, IsString } from "@nestjs/class-validator"
import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty } from "class-validator"
import { IsUnique } from "src/common/decorators/is-unique.decorator"

export class RegisterDto {
    @IsString()
    @IsNotEmpty()
    @IsUnique({tableName: 'user', column: 'username'})
    @ApiProperty({ type: String, description: 'Username of the user' })
    username: string

    @IsEmail()
    @ApiProperty({ type: String, format: 'email', description: 'Email of the user' })
    email: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ type: String, description: 'Password of the user' })
    password: string
}
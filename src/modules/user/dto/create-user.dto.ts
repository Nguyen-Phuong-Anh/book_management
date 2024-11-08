import { IsArray } from "@nestjs/class-validator"
import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsString } from "class-validator"
import { IsUnique } from "src/common/decorators/is-unique.decorator"
import { Role } from "src/common/enum/role.enum"

export class CreateUserDto {
    @IsString()
    @IsUnique({tableName: 'user', column: 'username'})
    @ApiProperty({type: String, description: 'Username of the user'})
    username: string

    @IsEmail()
    @IsUnique({tableName: 'user', column: 'email'})
    @ApiProperty({ type: String, format: 'email', description: 'Email of the user' })
    email: string

    @IsString()
    @ApiProperty({ type: String, description: 'Password of the user' })
    password: string
    
    @IsArray()
    @ApiProperty({ enum: Role, isArray: true, description: 'Roles of the user' })
    roles: Role[]
}
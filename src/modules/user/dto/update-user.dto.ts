import { IsArray, IsEmail, IsOptional, IsString } from "@nestjs/class-validator"
import { ApiProperty } from "@nestjs/swagger"
import { IsUnique } from "src/common/decorators/is-unique.decorator"
import { Role } from "src/common/enum/role.enum"

export class UpdateUserDto {
    @IsString()
    @IsOptional()
    @IsUnique({tableName: 'user', column: 'username'})
    @ApiProperty({type: String, description: 'Username of the user'})
    username?: string

    @IsEmail()
    @IsOptional()
    @IsUnique({tableName: 'user', column: 'email'})
    @ApiProperty({ type: String, format: 'email', description: 'Email of the user' })
    email?: string

    @IsString()
    @IsOptional()
    @ApiProperty({ type: String, description: 'Password of the user' })
    password?: string
    
    @IsArray()
    @IsOptional()
    @ApiProperty({ enum: Role, isArray: true, description: 'Roles of the user' })
    roles: Role[]
}
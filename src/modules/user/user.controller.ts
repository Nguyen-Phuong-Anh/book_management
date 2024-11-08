import { Body, Controller, Delete, Get, Param, Post, Put, Req, SetMetadata, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Reflector } from '@nestjs/core';
import { CreateUserDto } from './dto/create-user.dto';
import { Role } from 'src/common/enum/role.enum';
import { Roles } from 'src/common/decorators/role.decorator';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
@ApiTags('users')
export class UserController {
    constructor(
        private readonly reflector: Reflector,
        private readonly userService: UserService
    ) {}

    @Roles(Role.Admin)
    @Put('/update/:id')
    @ApiOperation({ summary: "Update an user"})
    @ApiParam({ name: 'id', type: Number, description: 'Id of the user'})
    @ApiBody({ type: UpdateUserDto })
    @ApiResponse({ status: 200, description: 'Update user successfully'})
    async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
        const updatedUser = await this.userService.update(id, updateUserDto)
        return {
            data: [updatedUser],
            type: 'user'
        }
    }

    @SetMetadata('isCacheable', true)
    @Get('/profile')
    @ApiOperation({ summary: "Get the profile of current user"})
    @ApiResponse({ status: 200, description: 'The profile of user returned successfully'})
    async findProfile(@Req() req: Request) {
        const isCacheable = this.reflector.get<boolean>('isCacheable', UserController.prototype.findProfile);
        const profile = await this.userService.findProfile(req['user'].sub)
        return {
            data: [profile],
            isCacheable: isCacheable,
            type: 'user'
        }
    }

    @SetMetadata('isCacheable', false)
    @Put('/profile')
    @ApiOperation({ summary: "Update the profile of current user"})
    @ApiBody({ type: UpdateProfileDto })
    @ApiResponse({ status: 200, description: 'Update proflie successfully'})
    async updateProfile(@Req() req: Request, @Body() updateProfileDto: UpdateProfileDto) {
        const isCacheable = this.reflector.get<boolean>('isCacheable', UserController.prototype.updateProfile);
        const updatedProfile = this.userService.updateProfile(req['user'].sub, updateProfileDto)   
        return { 
            data: [updatedProfile],
            isCacheable: isCacheable,
            type: 'user'
        }
    }

    @Roles(Role.Admin)
    @Post('/create')
    @ApiOperation({ summary: "Create new user"})
    @ApiBody({ type: CreateUserDto })
    @ApiResponse({ status: 200, description: 'Create user successfully'})
    async createUser(@Body() createUserDto: CreateUserDto) {
        const user = await this.userService.createUser(createUserDto);
        return {
            data: [user],
            type: 'user'
        }
    }

    @Roles(Role.Admin)
    @Delete('/:id')
    @ApiOperation({ summary: "Delete an user"})
    @ApiParam({ name: 'id', type: Number, description: 'Id of the user'})
    @ApiResponse({ status: 304, description: 'Delete user successfully'})
    async delete(@Param('id') id: number) {
        await this.userService.delete(id)
        return {}
    }
}

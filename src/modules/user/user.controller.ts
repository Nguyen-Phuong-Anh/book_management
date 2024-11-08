import { Body, Controller, Get, Put, Req, SetMetadata, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Reflector } from '@nestjs/core';

@Controller('users')
@ApiTags('users')
export class UserController {
    constructor(
        private readonly reflector: Reflector,
        private readonly userService: UserService
    ) {}

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
}

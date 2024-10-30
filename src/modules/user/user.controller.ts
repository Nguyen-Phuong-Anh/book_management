import { Body, Controller, Get, Put, Req, SetMetadata, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @SetMetadata('isCacheable', true)
    @Get('/profile')
    @ApiOperation({ summary: "Get the profile of current user"})
    @ApiResponse({ status: 200, description: 'The profile of user returned successfully'})
    async findProfile(@Req() req: Request) {
        console.log(req['user'].sub)
        const profile = await this.userService.findProfile(req['user'].sub)
        return {
            data: [profile]
        }
    }

    @SetMetadata('isCacheable', false)
    @Put('/profile')
    @ApiOperation({ summary: "Update the profile of current user"})
    @ApiBody({ type: UpdateProfileDto })
    @ApiResponse({ status: 200, description: 'Update proflie successfully'})
    async updateProfile(@Req() req: Request, @Body() updateProfileDto: UpdateProfileDto) {
        const updatedProfile = this.userService.updateProfile(req['user'].sub, updateProfileDto)   
        return { 
            data: updatedProfile
        }
    }
}

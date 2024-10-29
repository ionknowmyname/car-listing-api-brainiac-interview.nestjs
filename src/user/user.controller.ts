import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { ErrorResponse } from './dto/response/error.response';
import { SuccessResponse } from './dto/response/success.response';
import { CreateUser, UserDto } from './dto/user.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('create')
  async createUser(
    @Body() data: CreateUser,
  ): Promise<ErrorResponse<string> | SuccessResponse<UserDto>> {
    try {
      const response = await this.userService.createUser(data);

      return {
        statusCode: HttpStatus.CREATED,
        message: 'User created successfully!',
        data: response,
      };
    } catch (error) {
      return {
        statusCode: error?.error?.code,
        message: error.message,
        error: 'Failed to create user!',
      };
    }
  }
}

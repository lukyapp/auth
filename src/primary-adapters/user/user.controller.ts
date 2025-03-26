import { Body, Controller, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserCreatorByPasswordStrategy } from '../../application/user/services/user-creator/user.creator.by-password-strategy';
import { CreateOneUserUseCase } from '../../application/user/use-cases/create-one-user.use-case';
import { DeleteOneUserUseCase } from '../../application/user/use-cases/delete-one-user.use-case';
import { FindAllUsersUseCase } from '../../application/user/use-cases/find-all-users.use-case';
import { FindOneUserUseCase } from '../../application/user/use-cases/find-one-user.use-case';
import { UpdateOneUserUseCase } from '../../application/user/use-cases/update-one-user.use-case';
import { ApiBearerAuth } from '../common/decorators/api-bearer-auth.decorator';
import { Delete, Get, Patch, Post } from '../common/decorators/http.decorator';
import { CreateUserBody } from './dtos/create-user.body';
import { GetUserBody } from './dtos/get-user.body';
import { UpdateUserBody } from './dtos/update-user.body';

@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(
    private readonly userCreatorByPassword: UserCreatorByPasswordStrategy,
    private readonly findOneUserUseCase: FindOneUserUseCase,
    private readonly createOneUserUseCase: CreateOneUserUseCase,
    private readonly updateOneUserUseCase: UpdateOneUserUseCase,
    private readonly deleteOneUserUseCase: DeleteOneUserUseCase,
    private readonly findAllUsersUseCase: FindAllUsersUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User successfully created' })
  createUser(@Body() createUserDto: CreateUserBody) {
    return this.createOneUserUseCase.perform(
      this.userCreatorByPassword,
      createUserDto,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Return all users' })
  getAllUsers() {
    return this.findAllUsersUseCase.perform(new GetUserBody());
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by id' })
  @ApiResponse({ status: 200, description: 'Return the user' })
  @ApiResponse({ status: 404, description: 'User not found' })
  findOneUser(@Param('id') id: string) {
    return this.findOneUserUseCase.performById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a user' })
  @ApiResponse({ status: 200, description: 'User successfully updated' })
  @ApiResponse({ status: 404, description: 'User not found' })
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserBody) {
    return this.updateOneUserUseCase.perform(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({ status: 200, description: 'User successfully deleted' })
  @ApiResponse({ status: 404, description: 'User not found' })
  deleteUser(@Param('id') id: string) {
    return this.deleteOneUserUseCase.perform(id);
  }
}

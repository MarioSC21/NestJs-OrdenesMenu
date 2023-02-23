import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { CreateAuthDto } from './dto/create-auth.dto'
import { UpdateAuthDto } from './dto/update-auth.dto'
import { Auth } from './decorators'
// import { Auth as User } from './entities/auth.entity'
import { validRoles } from './interfaces'
import { LoginUserDto } from './dto'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto)
  }

  @Post('login')
  login(@Body() loginAuthDto: LoginUserDto) {
    return this.authService.login(loginAuthDto)
  }

  // @Get('private')
  // @Auth(validRoles.admin)
  // privateRoute3(@GetUser() user: User) {
  //   return {
  //     ok: true,
  //     message: 'This is a private route',
  //     user
  //   }
  // }

  @Get()
  @Auth(validRoles.admin, validRoles.superUser)
  findAll() {
    return this.authService.findAll()
  }

  @Get(':id')
  @Auth(validRoles.admin, validRoles.superUser)
  findOne(@Param('id') id: string) {
    return this.authService.findOne(id)
  }

  @Patch(':id')
  @Auth(validRoles.admin, validRoles.superUser)
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(id, updateAuthDto)
  }

  @Delete(':id')
  @Auth(validRoles.admin, validRoles.superUser)
  remove(@Param('id') id: string) {
    return this.authService.remove(id)
  }
}

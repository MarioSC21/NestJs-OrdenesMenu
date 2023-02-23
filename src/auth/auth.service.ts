import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common'
import { LoginUserDto, CreateAuthDto } from './dto'
import { UpdateAuthDto } from './dto/update-auth.dto'
import * as bcrypt from 'bcrypt'
import { Auth as User } from './entities/auth.entity'
import { Repository } from 'typeorm'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { JwtPayload } from './interfaces'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService
  ) {}

  async create(createAuthDto: CreateAuthDto) {
    try {
      const { password, ...userData } = createAuthDto
      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10)
      })
      await this.userRepository.save(user)
      delete user.password
      return {
        ...user,
        refresh: this.getJwtToken({ id: user.id, email: user.email }),
        access: this.getJwtToken({ id: user.id, email: user.email })
      }
    } catch (error) {
      this.handleErrors(error)
    }
  }

  async login(loginAuthDto: LoginUserDto) {
    const { password, email } = loginAuthDto

    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true, id: true }
    })

    if (!user) {
      throw new UnauthorizedException('Invalid credentials')
    }
    if (!bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException('Invalid credentials')
    }

    return {
      ...user,
      refresh: this.getJwtToken({ id: user.id, email: user.email }),
      access: this.getJwtToken({ id: user.id, email: user.email })
    }
  }

  async findAll() {
    const users = await this.userRepository.find()
    return users
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOneBy({ id })
    if (!user) {
      throw new NotFoundException(`User with ${id} not found`)
    }
    return user
  }

  async update(id: string, updateAuthDto: UpdateAuthDto) {
    const { password, ...UpdateAuthDto } = updateAuthDto
    const user = await this.findOne(id)

    const updateUser = {
      ...user,
      ...UpdateAuthDto,
      password: password ? bcrypt.hashSync(password, 10) : user.password
    }

    try {
      await this.userRepository.update(id, updateUser)
    } catch (error) {
      this.handleErrors(error)
    }

    return {
      message: 'User updated',
      user: updateUser
    }
  }

  async remove(id: string) {
    const user = await this.findOne(id)
    try {
      await this.userRepository.remove(user)
      return {
        message: 'User deleted',
        user
      }
    } catch (error) {
      this.handleErrors(error)
    }
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload)
    return token
  }

  private handleErrors(error: any): never {
    console.log(error)
    if (error.code === '23505') {
      throw new BadRequestException(`Email already exists ${error.detail}}`)
    }
    throw new InternalServerErrorException(
      "We're having some problems. Try again later."
    )
  }
}

import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Auth } from '../entities/auth.entity'
import { JwtPayload } from '../interfaces/jwt-payload.interface'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ConfigService } from '@nestjs/config'
import { Injectable, UnauthorizedException } from '@nestjs/common'

//Todo esto se queda en request al momento de implementar el guard este por defecto se ejecuta en cada request que implemente el guard
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(Auth) private readonly userRepository: Repository<Auth>,
    configService: ConfigService
  ) {
    super({
      secretOrKey: configService.get('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    })
  }

  async validate(payload: JwtPayload): Promise<Auth> {
    const { id } = payload

    const user = await this.userRepository.findOneBy({ id })

    if (!user) {
      throw new UnauthorizedException('Invalid credentials')
    }
    if (!user.is_active) {
      throw new UnauthorizedException('User is not active')
    }
    return user
  }
}

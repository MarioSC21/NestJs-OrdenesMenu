import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Observable } from 'rxjs'
import { META_ROLES } from 'src/auth/decorators/role-protected.decorator'
import { Auth } from '../entities/auth.entity'

//todo el guard se ejecuta antes de que se ejecute el controlador y se encarga de validar los roles del usuario
@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const valdRoles: string[] = this.reflector.get<string[]>(
      META_ROLES, //? tomamos del decorador @SetMetadata(META_ROLES, roles)
      context.getHandler()
    ) // obitene los roles que se le pasan al decorador

    if (!valdRoles) {
      return true
    }

    if (valdRoles.length === 0) {
      return true
    }
    const request = context.switchToHttp().getRequest()
    const user = request.user as Auth

    if (!user) {
      throw new BadRequestException('User not found')
    }

    for (const role of user.roles) {
      if (valdRoles.includes(role)) {
        return true
      }
    }

    throw new ForbiddenException(
      `User ${user.fullName} need a valid role: ${valdRoles}`
    )
    // console.log('valdRoles', user.roles)
    // return true
  }
}

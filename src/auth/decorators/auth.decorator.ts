import { UseGuards, applyDecorators } from '@nestjs/common'
import { validRoles } from '../interfaces'
import { RoleProtected } from './role-protected.decorator'
import { AuthGuard } from '@nestjs/passport'
import { UserRoleGuard } from '../guards/user-role.guard'

// todo crear un decorador que combine los dos decoradores anteriores
// TODO lo podemos usar @Auth() o @Auth('ADMIN', 'USER') para proteger las rutas
export function Auth(...roles: validRoles[]) {
  return applyDecorators(
    RoleProtected(...roles), //? esto es igual a @SetMetadata('roles', ['ADMIN', 'USER']) pero con el decorador personalizado y le pasamos los roles
    UseGuards(AuthGuard(), UserRoleGuard) //? esto es igual a @UseGuards(AuthGuard(), UserRoleGuard), UseRolesGuard() es guard personalizado
  )
}

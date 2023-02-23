import { SetMetadata } from '@nestjs/common'
import { validRoles } from '../interfaces'

export const META_ROLES = 'roles'
export const RoleProtected = (...args: validRoles[]) => {
  return SetMetadata(META_ROLES, args) //setMetadata es un decorador de nestjs pero al colocarlo en otro decorador no se coloca el @
  //? Esto es igual a @SetMetadata('roles', ['ADMIN', 'USER'])
  //? Y colocamos el guard @UseGuards(AuthGuard(), UserRoleGuard)
  //? Pero ahora en vez de colocar @SetMetadata('roles', ['ADMIN', 'USER']) colocamos @RoleProtected('ADMIN', 'USER')
}

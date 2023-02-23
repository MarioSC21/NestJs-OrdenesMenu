import {
  ExecutionContext,
  InternalServerErrorException,
  createParamDecorator
} from '@nestjs/common'

// todo esto es para crear un decorador personalizado a nivel de propiedad
export const GetUser = createParamDecorator((data, ctx: ExecutionContext) => {
  //? data es lo que se le pasa como argumento al decorador ejm: @GetUser('id') -> el data seria 'id'
  //? ctx es el contexto de ejecucion de la funcion

  const request = ctx.switchToHttp().getRequest() // Obtenemos el request del contexto de ejecucion
  const user = request.user

  if (!user) {
    throw new InternalServerErrorException('User not found')
  }

  return !data ? user : user[data]
})

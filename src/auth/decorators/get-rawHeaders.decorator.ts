import {
  ExecutionContext,
  InternalServerErrorException,
  createParamDecorator
} from '@nestjs/common'

export const RawHeaders = createParamDecorator(
  (data, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()
    const headers = request.rawHeaders

    if (!headers) {
      throw new InternalServerErrorException('Headers not found')
    }

    return headers
  }
)

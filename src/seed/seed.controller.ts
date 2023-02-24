import { Controller, Get } from '@nestjs/common'
import { SeedService } from './seed.service'
// import { ApiTags } from '@nestjs/swagger/dist/decorators'

// @ApiTags('Seed')
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get()
  // @Auth(validRoles.admin)
  findAll() {
    return this.seedService.runSeed()
  }
}

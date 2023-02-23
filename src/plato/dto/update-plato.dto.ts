import { PartialType } from '@nestjs/mapped-types'
import { CreatePlatoDto } from './create-plato.dto'

export class UpdatePlatoDto extends PartialType(CreatePlatoDto) {}

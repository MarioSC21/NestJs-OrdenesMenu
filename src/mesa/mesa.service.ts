import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException
} from '@nestjs/common'
import { CreateMesaDto } from './dto/create-mesa.dto'
import { UpdateMesaDto } from './dto/update-mesa.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Mesa } from './entities/mesa.entity'
import { validate as isUUID } from 'uuid'
import { Repository } from 'typeorm'

@Injectable()
export class MesaService {
  private readonly logger = new Logger('ProductsService')

  constructor(
    @InjectRepository(Mesa)
    private readonly mesaRepository: Repository<Mesa>
  ) {}

  async create(createMesaDto: CreateMesaDto) {
    try {
      const { mesa_cap, mesa_nro } = createMesaDto
      const mesa = this.mesaRepository.create({ mesa_cap, mesa_nro })
      await this.mesaRepository.save(mesa)
      return mesa
    } catch (error) {
      this.handleError(error)
    }
  }

  async findAll() {
    const mesas = await this.mesaRepository.find()
    return {
      ok: true,
      content: mesas
    }
  }

  async findOne(id: string) {
    let mesa: Mesa
    if (isUUID(id)) {
      mesa = await this.mesaRepository.findOneBy({ mesa_id: id })
    }
    if (!mesa) {
      throw new NotFoundException(`Mesa con el id : ${id} no encontrado`)
    }
    return mesa
  }

  async update(id: string, updateMesaDto: UpdateMesaDto) {
    try {
      const { mesa_cap, mesa_nro } = updateMesaDto

      const mesa = await this.findOne(id)
      mesa.mesa_cap = mesa_cap
      mesa.mesa_nro = mesa_nro
      await this.mesaRepository.save(mesa)
      return mesa
    } catch (error) {
      this.handleError(error)
    }
  }

  async remove(id: string) {
    const mesa = await this.findOne(id)
    await this.mesaRepository.remove(mesa)
    return {
      message: 'Mesa eliminada',
      mesa
    }
  }

  private handleError(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail)
    }
    if (error.code === '23502') {
      throw new NotFoundException(
        'El numero de la Mesa no existe el numero de la mesa es : ' +
          error.column
      )
    }
    this.logger.error(error)
    throw new InternalServerErrorException('Unexpected error')
  }
}

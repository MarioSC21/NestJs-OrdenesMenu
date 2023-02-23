import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException
} from '@nestjs/common'
import { CreatePedidoPlatoDto, UpdatePedidoPlatoDto } from './dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { PedidoPlato } from './entities/pedido-plato.entity'

@Injectable()
export class PedidoPlatoService {
  private readonly logger = new Logger('PedidoService')

  constructor(
    @InjectRepository(PedidoPlato)
    private readonly pedidoPlatoRepository: Repository<PedidoPlato>
  ) {}

  async create(createPedidoPlatoDto: CreatePedidoPlatoDto) {
    try {
      const pedidoPlato = await this.pedidoPlatoRepository.create({
        ...createPedidoPlatoDto
      })
      await this.pedidoPlatoRepository.save(pedidoPlato)
      return pedidoPlato
    } catch (error) {
      this.handleError(error)
    }
  }

  async findAll() {
    const pedidoPlatos = await this.pedidoPlatoRepository.find()
    return pedidoPlatos
  }

  async findOne(id: string) {
    const pedidoPlato = await this.pedidoPlatoRepository.findOneBy({
      pedidoplato_id: id
    })
    if (!pedidoPlato) {
      throw new NotFoundException(`PedidoPlato con el id : ${id} no encontrado`)
    }

    return pedidoPlato
  }

  async update(id: string, updatePedidoPlatoDto: UpdatePedidoPlatoDto) {
    const pedidoPlato = await this.findOne(id)

    const updatePedidoPlato = {
      ...pedidoPlato,
      ...updatePedidoPlatoDto
    }

    await this.pedidoPlatoRepository.update(id, updatePedidoPlato)
    return {
      message: `PedidoPlato con el id : ${id} actualizado`,
      updatePedidoPlato
    }
  }

  async remove(id: string) {
    const pedidoPlato = await this.findOne(id)
    await this.pedidoPlatoRepository.remove(pedidoPlato)
    return {
      message: `PedidoPlato con el id : ${id} eliminado`,
      pedidoPlato
    }
  }

  private handleError(error: any) {
    console.log(error)
    if (error.code === '23505') {
      throw new BadRequestException(error.detail)
    }
    if (error.code === '23502') {
      throw new NotFoundException(
        'El nombre del pedidoPlato no existe el nombre del pedido es ' +
          error.column
      )
    }
    if (error.code === '23503') {
      throw new NotFoundException(`${error.detail}`)
    }
    if (error.code === '22P02') {
      throw new BadRequestException(`UUID no valido`)
    }
    this.logger.error(error)
    throw new InternalServerErrorException('Unexpected error')
  }
}

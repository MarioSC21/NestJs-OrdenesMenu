import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException
} from '@nestjs/common'
import { CreatePedidoDto, UpdatePedidoDto } from './dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Pedido } from './entities/pedido.entity'
import { Repository, DataSource } from 'typeorm'
import { PedidoPlatoService } from './pedidoPlato.service'

@Injectable()
export class PedidoService {
  private readonly logger = new Logger('PedidoService')

  constructor(
    @InjectRepository(Pedido)
    private readonly pedidoRepository: Repository<Pedido>,
    private readonly pedidoplatoService: PedidoPlatoService,
    private readonly dataSource: DataSource // para hacer transacciones
  ) {}

  async create(createPedidoDto: CreatePedidoDto) {
    const { pedidoplatos: pedPlatos, ...createpedidoDto } = createPedidoDto

    //? Iniciar la transaccion
    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      const pedido_fech = new Date(createPedidoDto.pedido_fech)

      const pedido = await this.pedidoRepository.create({
        ...createpedidoDto,
        pedido_fech: pedido_fech ?? pedido_fech
      })

      await queryRunner.manager.save(pedido) //? Insertar el pedido

      await queryRunner.commitTransaction()

      const pedidoPlatos = pedPlatos.map((plato) =>
        this.pedidoplatoService.create({
          ...plato,
          pedido_id: pedido.pedido_id as unknown as Pedido
        })
      )

      const pedidoplatos = await Promise.all(pedidoPlatos)

      await queryRunner.release()

      return {
        ok: true,
        content: {
          ...pedido,
          pedidoplatos
        }
      }
    } catch (error) {
      await queryRunner.rollbackTransaction()
      await queryRunner.release()
      this.handleError(error)
    }
  }

  async findAll() {
    const pedidos = await this.pedidoRepository.find({
      relations: ['mesa_id', 'usu_id', 'pedidoplatos']
    })
    return {
      ok: true,
      pedidos: pedidos.map((pedido) => {
        const { mesa_id, usu_id } = pedido
        return {
          ...pedido,
          mesa_id: mesa_id.mesa_id,
          usu_id: usu_id.id,
          pedidoplatos: pedido.pedidoplatos.map((pedido_plato) => {
            return {
              ...pedido_plato,
              plato_id: pedido_plato.plato_id.plato_id,
              pedido_id: pedido_plato.pedido_id.pedido_id
            }
          })
        }
      })
    }
  }

  async findOne(id: string) {
    const pedido = await this.pedidoRepository.findOne({
      where: { pedido_id: id },
      relations: ['mesa_id', 'usu_id']
    })
    if (!pedido) {
      throw new NotFoundException(`Pedido con el id : ${id} no encontrado`)
    }
    return {
      ...pedido,
      mesa_id: pedido.mesa_id.mesa_id,
      usu_id: pedido.usu_id.id
    }
  }

  async update(id: string, updatePedidoDto: UpdatePedidoDto) {
    const pedido = await this.findOne(id)

    const pedidoUopdate = {
      ...pedido,
      ...updatePedidoDto,
      mesa_id: updatePedidoDto.mesa_id,
      usu_id: updatePedidoDto.usu_id
    }

    try {
      await this.pedidoRepository.save(pedidoUopdate)
      return {
        message: `Pedido con el id : ${id} actualizado`,
        pedidoUopdate
      }
    } catch (error) {
      this.handleError(error)
    }
  }

  async remove(id: string) {
    const pedido = await this.findOne(id)
    await this.pedidoRepository.delete(id)
    return {
      message: `Pedido con el id : ${id} eliminado`,
      pedido
    }
  }

  async deleteAllPedido() {
    const query = await this.pedidoRepository.createQueryBuilder('pedido')
    return await query.delete().where({}).execute()
  }

  private handleError(error: any) {
    console.log(error)
    if (error.code === '23505') {
      throw new BadRequestException(error.detail)
    }
    if (error.code === '23502') {
      throw new NotFoundException(
        'El nombre del pedido no existe el nombre del pedido es ' + error.column
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

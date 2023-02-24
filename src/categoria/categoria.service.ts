import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException
} from '@nestjs/common'
import { CreateCategoriaDto } from './dto/create-categoria.dto'
import { UpdateCategoriaDto } from './dto/update-categoria.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Categoria } from './entities/categoria.entity'
import { Repository } from 'typeorm'
import { validate as isUUID } from 'uuid'

@Injectable()
export class CategoriaService {
  private readonly logger = new Logger('ProductsService')
  constructor(
    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>
  ) {}

  async create(createCategoriaDto: CreateCategoriaDto) {
    try {
      const { categoria_nom } = createCategoriaDto
      const categoria = this.categoriaRepository.create({ categoria_nom })
      await this.categoriaRepository.save(categoria)
      return categoria
    } catch (error) {
      this.handleError(error)
    }
  }

  async findAll() {
    const categorias = await this.categoriaRepository.find()
    return {
      ok: true,
      content: categorias
    }
  }

  private async findOne(id: string) {
    let categoria: Categoria

    if (isUUID(id)) {
      categoria = await this.categoriaRepository.findOneBy({ categoria_id: id })
    }
    if (!categoria) {
      throw new NotFoundException(`Categoria con el id : ${id} no encontrado`)
    }
    return categoria
  }

  async findOnePlatoCategoria(id: string) {
    let categoria: Categoria

    if (isUUID(id)) {
      categoria = await this.categoriaRepository
        .createQueryBuilder('categoria')
        .leftJoinAndSelect('categoria.platos', 'plato')
        .leftJoinAndSelect('plato.plato_img', 'plato_img')
        .leftJoinAndSelect('plato.categoria_id', 'categoria_plato')
        .where('categoria.categoria_id = :id', { id })
        .getOne()
    }
    if (!categoria) {
      throw new NotFoundException(`Categoria con el id : ${id} no encontrado`)
    }
    return {
      ok: true,
      content: {
        ...categoria,
        Platos: categoria.platos.map((plato) => {
          return {
            ...plato,
            plato_pre: plato.plato_pre.toString(),
            plato_img: plato.plato_img.image_url,
            categoria_id: plato.categoria_id.categoria_id
          }
        })
      }
    }
  }

  async update(id: string, updateCategoriaDto: UpdateCategoriaDto) {
    const { categoria_nom } = updateCategoriaDto

    const categoria = await this.findOne(id)
    categoria.categoria_nom = categoria_nom
    await this.categoriaRepository.save(categoria)
    return categoria
  }

  async remove(id: string) {
    const categoria = await this.findOne(id)
    await this.categoriaRepository.remove(categoria)
    return {
      message: `Categoria con el id : ${id} eliminado`,
      body: categoria
    }
  }

  async deleteAllCategoria() {
    const query = await this.categoriaRepository.createQueryBuilder('categoria')
    try {
      return await query.delete().where({}).execute()
    } catch (error) {
      this.handleError(error)
    }
  }

  private handleError(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail)
    }
    if (error.code === '23502') {
      throw new NotFoundException(
        'El nombre de la categoria no existe el nombre de la categoria es ' +
          error.column
      )
    }
    this.logger.error(error)
    throw new InternalServerErrorException('Unexpected error')
  }
}

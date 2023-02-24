import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException
} from '@nestjs/common'
import { CreatePlatoDto } from './dto/create-plato.dto'
import { UpdatePlatoDto } from './dto/update-plato.dto'
import { CloudinaryService } from 'src/cloudinary/cloudinary.service'
import { InjectRepository } from '@nestjs/typeorm'
import { Plato } from './entities/plato.entity'
import { validate as isUUID } from 'uuid'
import { Repository } from 'typeorm'
import { Imagenes } from './entities/images.entity'

@Injectable()
export class PlatoService {
  private readonly logger = new Logger('PlatoService')

  constructor(
    @InjectRepository(Plato)
    private readonly platoRepository: Repository<Plato>,
    @InjectRepository(Imagenes)
    private readonly imagenesRepository: Repository<Imagenes>,
    private readonly cloudinary: CloudinaryService
  ) {}

  async create(createPlatoDto: CreatePlatoDto, file: Express.Multer.File) {
    let plato: Plato
    let imagenes: Imagenes

    if (!file) throw new BadRequestException('No se ha subido ninguna imagen')
    try {
      const { url, public_id } = await this.uploadImageToCloudinary(file)

      imagenes = this.imagenesRepository.create({
        image_url: url,
        image_public_id: public_id
      })

      await this.imagenesRepository.save(imagenes)

      plato = this.platoRepository.create({
        ...createPlatoDto,
        categoria_id: createPlatoDto.categoria_id,
        plato_img: imagenes
      })
      await this.platoRepository.save(plato)
      return {
        ...plato,
        plato_img: imagenes.image_url
      }
    } catch (error) {
      this.deleteImageFromCloudinary({ idImage: imagenes.image_public_id })
      this.handleError(error)
    }
  }

  async findAll() {
    const queryBuilder = await this.platoRepository
      .createQueryBuilder('plato')
      .leftJoinAndSelect('plato.categoria_id', 'categoria')
      .leftJoinAndSelect('plato.plato_img', 'imagenes')
      .select([
        'plato.plato_id',
        'plato.plato_nom',
        'plato.plato_pre',
        'imagenes.image_url',
        'categoria.categoria_id'
      ])
      .getMany()
    return {
      ok: true,
      content: queryBuilder.map((plato) => {
        return {
          ...plato,
          plato_pre: plato.plato_pre.toString(),
          categoria_id: plato.categoria_id.categoria_id,
          plato_img: plato.plato_img.image_url
        }
      })
    }
  }

  async findOne(id: string) {
    let plato: Plato
    if (isUUID(id)) {
      plato = await this.platoRepository.findOne({
        where: { plato_id: id },
        relations: ['categoria_id', 'plato_img']
      })
    } else {
      const QueryBuilder = await this.platoRepository.createQueryBuilder(
        'plato'
      )
      plato = await QueryBuilder.where(`plato_nom = :plato_nom`, {
        plato_nom: id
      })
        .leftJoinAndSelect('plato.categoria_id', 'categoria')
        .leftJoinAndSelect('plato.plato_img', 'imagenes')
        .getOne()
    }
    if (!plato) {
      throw new NotFoundException(`Plato con el id : ${id} no encontrado`)
    }
    return {
      ok: true,
      content: {
        ...plato,
        plato_pre: plato.plato_pre.toString(),
        categoria_id: plato.categoria_id.categoria_id,
        plato_img: plato.plato_img.image_url
      }
    }
  }

  async update(
    id: string,
    updatePlatoDto: UpdatePlatoDto,
    file?: Express.Multer.File
  ) {
    //actulizar plato con su categoria y su imagen

    const plato = await this.findOneImage(id)

    // Actualizar el objeto de la entidad con los datos del DTO
    const updatedPlato = {
      ...plato,
      ...updatePlatoDto
    }

    try {
      if (file) {
        const { url, public_id } = await this.cloudinary.updateImage(
          plato.plato_img.image_public_id,
          file
        )

        updatedPlato.plato_img = {
          ...plato.plato_img,
          image_url: url,
          image_public_id: public_id
        }

        await this.imagenesRepository.save(updatedPlato.plato_img)
      }

      await this.platoRepository.update(id, updatedPlato)
    } catch (error) {
      this.handleError(error)
    }

    return {
      ...updatedPlato,
      categoria_id:
        updatedPlato.categoria_id.categoria_id ?? updatedPlato.categoria_id,
      plato_img: updatedPlato.plato_img.image_url
    }
  }

  private async findOneImage(id: string) {
    const plato = await this.platoRepository.findOne({
      where: { plato_id: id },
      relations: ['categoria_id', 'plato_img']
    })
    if (!plato) {
      throw new NotFoundException(`Plato con el id : ${id} no encontrado`)
    }
    return plato
  }

  async remove(id: string) {
    const plato = await this.findOneImage(id)

    const { public_id } = await this.cloudinary.getImageInfo(
      plato.plato_img.image_public_id
    )
    await this.platoRepository.remove(plato)
    await this.imagenesRepository.remove(plato.plato_img)
    await this.deleteImageFromCloudinary({ idImage: public_id })
    return {
      message: `Plato con el id: ${id} eliminado`,
      plato: {
        ...plato,
        categoria_id: plato.categoria_id.categoria_id,
        plato_img: plato.plato_img.image_url
      }
    }
  }

  async uploadImageToCloudinary(file: Express.Multer.File) {
    const image = await this.cloudinary.uploadImage(file).catch(() => {
      throw new BadRequestException('Invalid file type.')
    })
    return image
  }

  async deleteImageFromCloudinary({ idImage }: { idImage: string }) {
    await this.cloudinary
      .deleteImage({
        public_id: idImage
      })
      .then(() => {
        return true
      })
      .catch(() => {
        return false
      })
  }

  async deleteAllPlato() {
    const query = this.platoRepository.createQueryBuilder('plato')
    const queryImage = this.imagenesRepository.createQueryBuilder('imagenes')
    try {
      const platoDelete = await query.delete().where({}).execute()
      const imageDelete = await queryImage.delete().where({}).execute()

      // eliminar todas las imagenes de cloudinary
      await this.cloudinary.deleteAllImages()
      return {
        platoDelete,
        imageDelete
      }
    } catch (error) {
      this.handleError(error)
    }
  }

  private handleError(error: any) {
    // console.log(error)
    if (error.code === '23505') {
      throw new BadRequestException(error.detail)
    }
    if (error.code === '23502') {
      throw new NotFoundException(
        'El nombre del plato no existe el nombre del plato es ' + error.column
      )
    }
    if (error.code === '22P02') {
      throw new BadRequestException(`UUID no valido`)
    }
    this.logger.error(error)
    throw new InternalServerErrorException('Unexpected error')
  }
}

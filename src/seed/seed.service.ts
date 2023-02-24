import { Injectable } from '@nestjs/common'
// import { ProductsService } from './../products/products.service'
import { SeedPlatoC, initialData } from './data/seed.data'
import { InjectRepository } from '@nestjs/typeorm'
import { Auth } from 'src/auth/entities/auth.entity'
import { Repository } from 'typeorm'
import { MesaService } from 'src/mesa/mesa.service'
import { CategoriaService } from 'src/categoria/categoria.service'
import { PlatoService } from 'src/plato/plato.service'
import { PedidoService } from 'src/pedido/pedido.service'
import { PedidoPlatoService } from 'src/pedido/pedidoPlato.service'

@Injectable()
export class SeedService {
  constructor(
    private readonly mesaService: MesaService,
    private readonly categoriaService: CategoriaService,
    private readonly platoService: PlatoService,
    private readonly pedidoService: PedidoService,
    private readonly pedidoPlatoService: PedidoPlatoService,
    @InjectRepository(Auth)
    private readonly userRepository: Repository<Auth>
  ) {}

  async runSeed() {
    await this.deleteTables()
    await this.insertUsers()
    await this.insertMesas()
    const categoria = await this.insertCategorias()

    // await categoria[this.getRandomInt(categoria.length)]
    //? Modificar Categoria de platos con las categorias creadas
    const seedPlatos = initialData.platos
    const newPlato = seedPlatos.map(async ({ file, ...plato }) => {
      const cat = await Promise.all(categoria)
      const c = cat.map((c) => c.categoria_nom).indexOf(plato.categoria_id)

      const newPlato = {
        ...plato,
        categoria_id: c !== -1 ? cat[c] : cat[0],
        file
      }
      return newPlato
    })

    await this.insertPlatos(await Promise.all(newPlato))
    return `EXECUTED SEED`
  }

  private async deleteTables() {
    await this.platoService.deleteAllPlato()
    await this.pedidoPlatoService.deleteAllPedidoPlato()
    await this.pedidoService.deleteAllPedido()
    await this.categoriaService.deleteAllCategoria()
    await this.mesaService.deleteAllMesa()
    const queryBuilder = this.userRepository.createQueryBuilder()
    await queryBuilder.delete().where({}).execute()
    return true
  }

  private async insertUsers() {
    const seedUsers = initialData.users
    const user: Auth[] = []

    seedUsers.forEach((seedUser) => {
      user.push(this.userRepository.create(seedUser))
    })

    const dbUser = await this.userRepository.save(seedUsers)
    return dbUser[0]
  }

  private async insertMesas() {
    const seedMesas = initialData.mesas

    const mesaCreate = seedMesas.map(async (mesa) => {
      return await this.mesaService.create(mesa)
    })

    await Promise.all(mesaCreate) // esto es para que espere a que se creen todas las mesas

    return mesaCreate
  }

  private async insertCategorias() {
    const seedCategorias = initialData.categorias

    const categoriaCreate = seedCategorias.map(async (categoria) => {
      return await this.categoriaService.create(categoria)
    })

    await Promise.all(categoriaCreate) // esto es para que espere a que se creen todas las categorias

    return categoriaCreate
  }

  private async insertPlatos(seedPlatos: SeedPlatoC[]) {
    const platoCreate = seedPlatos.map(async ({ file, ...plato }) => {
      return await this.platoService.create(plato, file)
    })

    await Promise.all(platoCreate) // esto es para que espere a que se creen todas las categorias

    return platoCreate
  }

  private getRandomInt(max) {
    return Math.floor(Math.random() * max)
  }
}

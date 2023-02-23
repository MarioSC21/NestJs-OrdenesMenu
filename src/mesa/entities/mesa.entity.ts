import { Pedido } from 'src/pedido/entities/pedido.entity'
import { Plato } from 'src/plato/entities/plato.entity'
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

@Entity({
  name: 'mesa'
})
export class Mesa {
  @PrimaryGeneratedColumn('uuid')
  mesa_id: string

  @Column('text', {
    unique: true
  })
  mesa_nro: string

  @Column('int', {
    default: 1
  })
  mesa_cap: number

  @OneToMany(() => Plato, (plato) => plato.categoria_id, {
    cascade: true,
    eager: false // para que no se carguen las relaciones
  })
  pedidos: Pedido[]
}

import { Categoria } from 'src/categoria/entities/categoria.entity'
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn
} from 'typeorm'
import { Imagenes } from './images.entity'
import { PedidoPlato } from 'src/pedido/entities/pedido-plato.entity'

@Entity({
  name: 'plato'
})
export class Plato {
  @PrimaryGeneratedColumn('uuid')
  plato_id: string

  @Column('text')
  plato_nom: string // nombre del plato

  @Column('float', {
    default: 0
  })
  plato_pre: number // precio del plato

  @ManyToOne(() => Categoria, (categoria) => categoria.platos, {
    onDelete: 'CASCADE',
    nullable: false
  })
  @JoinColumn({
    name: 'categoria_id'
  })
  categoria_id: Categoria // id de la categoria a la que pertenece el plato

  @OneToOne(() => Imagenes, {
    onDelete: 'CASCADE',
    cascade: true,
    nullable: false
  })
  @JoinColumn({
    name: 'image_id'
  })
  plato_img: Imagenes // imagen del plato

  @OneToMany(() => PedidoPlato, (pedplato) => pedplato.plato_id, {
    cascade: true,
    eager: false // para que no se carguen las relaciones
  })
  pedidos_platos: PedidoPlato[]
}

import { Plato } from 'src/plato/entities/plato.entity'
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm'
import { Pedido } from './pedido.entity'

@Entity('pedidoplato')
export class PedidoPlato {
  @PrimaryGeneratedColumn('uuid')
  pedidoplato_id: string

  @Column('int', {
    default: 1
  })
  pedidoplato_cant: number

  @ManyToOne(() => Pedido, (pedido) => pedido.pedidoplatos, {
    onDelete: 'CASCADE',
    nullable: false,
    eager: true
  })
  @JoinColumn({
    name: 'pedido_id'
  })
  pedido_id: Pedido

  @ManyToOne(() => Plato, (plato) => plato.pedidos_platos, {
    onDelete: 'CASCADE',
    nullable: false,
    eager: true
  })
  @JoinColumn({
    name: 'plato_id'
  })
  plato_id: Plato
}

import { Auth } from 'src/auth/entities/auth.entity'
import { Mesa } from 'src/mesa/entities/mesa.entity'
import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm'
import { PedidoPlato } from './pedido-plato.entity'

@Entity('pedido')
export class Pedido {
  @PrimaryGeneratedColumn('uuid')
  pedido_id: string

  @Column('timestamp', {
    nullable: true
  })
  pedido_fech: Date

  @Column('text', {
    default: ''
  })
  pedido_nro: string

  @Column('text', { default: 'Pagado' })
  pedido_est: string

  @ManyToOne(() => Mesa, (mesa) => mesa.pedidos, {
    onDelete: 'CASCADE',
    nullable: false,
    eager: false
  })
  @JoinColumn({
    name: 'mesa_id'
  })
  mesa_id: Mesa

  @ManyToOne(() => Auth, (auth) => auth.pedidos, {
    onDelete: 'CASCADE',
    nullable: false,
    eager: false
  })
  @JoinColumn({
    name: 'usu_id'
  })
  usu_id: Auth

  @OneToMany(() => PedidoPlato, (pedplato) => pedplato.pedido_id, {
    cascade: true,
    eager: false
  })
  pedidoplatos: PedidoPlato[]

  @BeforeInsert()
  setPedidoFech() {
    this.pedido_fech = new Date()
  }
}

import { Pedido } from 'src/pedido/entities/pedido.entity'
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm'

@Entity('users')
export class Auth {
  @PrimaryGeneratedColumn()
  id: string

  @Column('text', { unique: true })
  email: string

  @Column('text', {
    select: false
  })
  password: string

  @Column('text', {
    nullable: true
  })
  fullName?: string

  @Column('bool', {
    default: true
  })
  is_active: boolean

  @Column('text', { array: true, default: ['user'] })
  roles: string[]

  @OneToMany(() => Pedido, (auth) => auth.usu_id, {
    cascade: true,
    eager: false // para que no se carguen las relaciones
  })
  pedidos: Pedido[]

  @BeforeInsert()
  checkFields() {
    this.email = this.email.toLowerCase().trim()
  }

  @BeforeUpdate()
  checkFieldsUpdate() {
    this.checkFields()
  }
}

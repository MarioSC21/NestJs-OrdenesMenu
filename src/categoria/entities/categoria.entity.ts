import { Plato } from 'src/plato/entities/plato.entity'
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm'

@Entity({
  name: 'categoria'
})
export class Categoria {
  @PrimaryGeneratedColumn('uuid')
  categoria_id: string

  @Column('text', {
    unique: true
  })
  categoria_nom: string

  @OneToMany(() => Plato, (plato) => plato.categoria_id, {
    cascade: true,
    eager: false // para que no se carguen las relaciones
  })
  platos: Plato[]

  @BeforeInsert()
  checkCategoriaNomInsert() {
    this.categoria_nom = this.categoria_nom.toLocaleLowerCase()
  }

  @BeforeUpdate()
  checkCategoriaNomUpdate() {
    this.categoria_nom = this.categoria_nom.toLocaleLowerCase()
  }
}

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity({
  name: 'imagenes'
})
export class Imagenes {
  @PrimaryGeneratedColumn('uuid')
  image_id: string

  @Column('text')
  image_public_id: string // id publico de la imagen

  @Column('text')
  image_url: string // url de la imagen
}

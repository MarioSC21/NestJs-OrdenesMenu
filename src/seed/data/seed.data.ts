import * as bcrypt from 'bcrypt'
import * as fs from 'fs'
import { Categoria } from 'src/categoria/entities/categoria.entity'

const imgPlato = {
  imgCerveza: fs.readFileSync('src/assets/cerveza-pilsen-bt-x-630-ml.jpg'),
  imgPastel: fs.readFileSync('src/assets/pastel.jpeg'),
  imgCausa: fs.readFileSync('src/assets/causa.jpg'),
  imgCeviche: fs.readFileSync('src/assets/ceviche.jpeg'),
  imgChicha: fs.readFileSync('src/assets/chicha.jpeg'),
  imgChichaJora: fs.readFileSync('src/assets/jora.jpeg'),
  imgLomoSaltado: fs.readFileSync('src/assets/lomoSaltado.jpeg'),
  imgOcopa: fs.readFileSync('src/assets/ocopa.jpeg'),
  imgQuesohelado: fs.readFileSync('src/assets/queseHelado.jpg'),
  imgSolteroQueso: fs.readFileSync('src/assets/receta-soltero-de-queso.jpg'),
  imgRocotoRelleno: fs.readFileSync('src/assets/rocoto.jpeg'),
  imgSuspiroLimeno: fs.readFileSync('src/assets/suspiroLimeno.jpg'),
  imgYuccaFrita: fs.readFileSync('src/assets/Yuca-frita.jpg')
}

interface Seedmesa {
  mesa_nro: string
  mesa_cap?: number
}

interface Seedcategoria {
  categoria_nom: string
}

interface Seedplato {
  plato_nom: string
  plato_pre?: number
  categoria_id: string
  file: Express.Multer.File
}

export interface SeedPlatoC extends Omit<Seedplato, 'categoria_id'> {
  categoria_id: Categoria
}

interface Seeduser {
  email: string
  password: string
  fullName?: string
}

interface Seeddata {
  users: Seeduser[]
  categorias: Seedcategoria[]
  platos: Seedplato[]
  mesas: Seedmesa[]
}

export const initialData: Seeddata = {
  users: [
    {
      email: 'userprueba@gmail.com',
      password: bcrypt.hashSync('userPrueba1', 10)
    },
    {
      email: 'userprueba2@gmail.com',
      password: bcrypt.hashSync('userPrueba2', 10)
    }
  ],
  categorias: [
    {
      categoria_nom: 'Entrada'
    },
    {
      categoria_nom: 'Plato fuerte'
    },
    {
      categoria_nom: 'Postre'
    },
    {
      categoria_nom: 'Bebida'
    },
    {
      categoria_nom: 'Menu'
    }
  ],
  mesas: [
    {
      mesa_nro: '1',
      mesa_cap: 4
    },
    {
      mesa_nro: '2',
      mesa_cap: 4
    },
    {
      mesa_nro: '3',
      mesa_cap: 5
    },
    {
      mesa_nro: '4',
      mesa_cap: 5
    },
    {
      mesa_nro: '5',
      mesa_cap: 2
    }
  ],
  //! Colocar la categoria_id siempre en minuscula
  platos: [
    {
      plato_nom: 'Cerveza',
      plato_pre: 15,
      categoria_id: 'bebida',
      file: {
        fieldname: 'cerveza_img',
        originalname: 'cerveza-pilsen-bt-x-630-ml.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        size: imgPlato.imgCerveza.length,
        buffer: imgPlato.imgCerveza
      } as Express.Multer.File
    },
    {
      plato_nom: 'Pastel',
      plato_pre: 20,
      categoria_id: 'postre',
      file: {
        fieldname: 'pastel_img',
        originalname: 'pastel.jpeg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        size: imgPlato.imgPastel.length,
        buffer: imgPlato.imgPastel
      } as Express.Multer.File
    },
    {
      plato_nom: 'Causa',
      plato_pre: 25,
      categoria_id: 'entrada',
      file: {
        fieldname: 'causa_img',
        originalname: 'causa.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        size: imgPlato.imgCausa.length,
        buffer: imgPlato.imgCausa
      } as Express.Multer.File
    },
    {
      plato_nom: 'Ceviche',
      plato_pre: 30,
      categoria_id: 'entrada',
      file: {
        fieldname: 'ceviche_img',
        originalname: 'ceviche.jpeg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        size: imgPlato.imgCeviche.length,
        buffer: imgPlato.imgCeviche
      } as Express.Multer.File
    },
    {
      plato_nom: 'Chicha',
      plato_pre: 35,
      categoria_id: 'bebida',
      file: {
        fieldname: 'chicha_img',
        originalname: 'chicha.jpeg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        size: imgPlato.imgChicha.length,
        buffer: imgPlato.imgChicha
      } as Express.Multer.File
    },
    {
      plato_nom: 'Chicha de jora',
      plato_pre: 40,
      categoria_id: 'bebida',
      file: {
        fieldname: 'chichaJora_img',
        originalname: 'jora.jpeg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        size: imgPlato.imgChichaJora.length,
        buffer: imgPlato.imgChichaJora
      } as Express.Multer.File
    },
    {
      plato_nom: 'Lomo saltado',
      plato_pre: 45,
      categoria_id: 'plato fuerte',
      file: {
        fieldname: 'lomoSaltado_img',
        originalname: 'lomoSaltado.jpeg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        size: imgPlato.imgLomoSaltado.length,
        buffer: imgPlato.imgLomoSaltado
      } as Express.Multer.File
    },
    {
      plato_nom: 'Ocopa',
      plato_pre: 50,
      categoria_id: 'entrada',
      file: {
        fieldname: 'ocopa_img',
        originalname: 'ocopa.jpeg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        size: imgPlato.imgOcopa.length,
        buffer: imgPlato.imgOcopa
      } as Express.Multer.File
    },
    {
      plato_nom: 'quesoHelado',
      plato_pre: 55,
      categoria_id: 'postre',
      file: {
        fieldname: 'quesoHelado_img',
        originalname: 'quesoHelado.jpeg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        size: imgPlato.imgQuesohelado.length,
        buffer: imgPlato.imgQuesohelado
      } as Express.Multer.File
    },
    {
      plato_nom: 'Soltero de queso',
      plato_pre: 60,
      categoria_id: 'entrada',
      file: {
        fieldname: 'solteroQueso_img',
        originalname: 'receta-soltero-de-queso.jpeg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        size: imgPlato.imgSolteroQueso.length,
        buffer: imgPlato.imgSolteroQueso
      } as Express.Multer.File
    },
    {
      plato_nom: 'rocoto',
      plato_pre: 65,
      categoria_id: 'menu',
      file: {
        fieldname: 'rocoto_img',
        originalname: 'rocoto.jpeg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        size: imgPlato.imgRocotoRelleno.length,
        buffer: imgPlato.imgRocotoRelleno
      } as Express.Multer.File
    },
    {
      plato_nom: 'suspiro Limeño',
      plato_pre: 70,
      categoria_id: 'postre',
      file: {
        fieldname: 'suspiroLimeño_img',
        originalname: 'suspiroLimeno.jpe',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        size: imgPlato.imgSuspiroLimeno.length,
        buffer: imgPlato.imgSuspiroLimeno
      } as Express.Multer.File
    },
    {
      plato_nom: 'Yuca frita',
      plato_pre: 75,
      categoria_id: 'menu',
      file: {
        fieldname: 'yucaFrita_img',
        originalname: 'Yuca-Frita.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        size: imgPlato.imgYuccaFrita.length,
        buffer: imgPlato.imgYuccaFrita
      } as Express.Multer.File
    }
  ]
}

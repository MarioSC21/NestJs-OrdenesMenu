import { Injectable } from '@nestjs/common'
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary'
import * as toStream from 'buffer-to-stream'
import { CloudinaryInfo } from './interface/infoImage.interface'

interface DeleteImageParams {
  public_id: string
}

@Injectable()
export class CloudinaryService {
  async uploadImage(
    file: Express.Multer.File
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream((error, result) => {
        if (error) return reject(error)
        resolve(result)
      })
      toStream(file.buffer).pipe(upload)
    })
  }

  async deleteImage(params: DeleteImageParams): Promise<boolean> {
    return new Promise((resolve, reject) => {
      v2.uploader.destroy(params.public_id, (error) => {
        if (error) {
          return reject(error)
        }
        // console.log(result)
        resolve(true)
      })
    })
  }

  async getImageInfo(idImage: string): Promise<CloudinaryInfo> {
    return new Promise((resolve, reject) => {
      v2.api.resource(idImage, (error, result) => {
        if (error) {
          reject(error)
        } else {
          resolve(result)
        }
      })
    })
  }

  async updateImage(
    public_id: string,
    file: Express.Multer.File
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    // Primero, elimina la imagen antigua de Cloudinary
    await this.deleteImage({ public_id })

    // Carga la nueva imagen en Cloudinary
    return this.uploadImage(file)
  }

  async deleteAllImages(): Promise<boolean> {
    try {
      const images = await v2.api.resources({
        type: 'upload',
        max_results: 50
      })
      const public_ids = images.resources.map((resource) => resource.public_id)
      const deletePromises = public_ids.map((public_id) =>
        this.deleteImage({ public_id })
      )
      await Promise.all(deletePromises)
      return true
    } catch (error) {
      console.error(error)
      return false
    }
  }
}

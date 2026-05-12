export type BackgroundColorId = 'red' | 'blue' | 'white'

export type PhotoSizeId = 'one-inch' | 'two-inch' | 'exam'

export type ProcessStatus = 'idle' | 'uploading' | 'processing' | 'success' | 'error'

export interface BackgroundColorOption {
  id: BackgroundColorId
  name: string
  value: string
}

export interface PhotoSizeOption {
  id: PhotoSizeId
  name: string
  width: number
  height: number
  unit: 'mm' | 'px'
  description: string
}

export interface UploadedPhoto {
  path: string
  width?: number
  height?: number
}

export interface RemoveBackgroundRequest {
  imagePath: string
}

export interface RemoveBackgroundResponse {
  imagePath: string
  width?: number
  height?: number
  status: 'success'
}

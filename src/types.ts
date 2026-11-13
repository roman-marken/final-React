export type CloudFile = {
  id: string
  name: string
  size: number
  type: string
  dataUrl: string
  createdAt: number
}

export type CloudFileMetadata = Omit<CloudFile, 'dataUrl'>

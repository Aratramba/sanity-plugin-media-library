export interface Asset {
  _createdAt: string,
  _id: string,
  alt?: string,
  mimeType: string,
  originalFilename: string,
  tags?: Array<string>,
  url: string,
}
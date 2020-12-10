export interface Asset {
  _createdAt: string;
  _id: string;
  alt?: string;
  extension: string;
  mimeType: string;
  originalFilename: string;
  size: number;
  tags?: Array<string>;
  title?: string;
  url: string;
}

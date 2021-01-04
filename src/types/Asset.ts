export type AssetType = 'sanity.imageAsset' | 'sanity.fileAsset';

export type Geopoint = {
  lat?: number
  lng?: number
  alt?: number
}
export interface Asset {
  _createdAt: string;
  _id: string;
  _type: AssetType;
  alt?: string;
  extension: string;
  metadata?: {
    ['dimensions']: {
      height: number;
      width: number;
    };
  };
  originalFilename: string;
  title?: string;
  size: number;
  location?: Geopoint;
  attribution?: string;
  tags?: Array<string>;
  url: string;
}

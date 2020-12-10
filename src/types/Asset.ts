export interface Asset {
  _createdAt: string;
  _id: string;
  alt?: string;
  extension: string;
  metadata: {
    ['dimensions']: {
      height: number;
      width: number;
    };
  };
  originalFilename: string;
  size: number;
  tags?: Array<string>;
  url: string;
}

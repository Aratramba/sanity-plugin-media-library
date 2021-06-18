import AssetSource from 'part:sanity-plugin-media-library/asset-source';

export default {
  name: 'imageAsset',
  title: 'Image Asset',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'imageAssetSource',
      type: 'image',
      title: 'With asset source',
      options: { sources: [AssetSource] },
    },
  ],
};

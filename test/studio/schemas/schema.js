import createSchema from 'part:@sanity/base/schema-creator';
import schemaTypes from 'all:part:@sanity/base/schema-type';

import imageAsset from './imageAsset';

export default createSchema({
  name: 'default',
  types: schemaTypes.concat([imageAsset]),
});

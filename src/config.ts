import config from 'config:media-library';

export const {
  theme = 'dark',
  themeChanges = {},
  assetFields = {
    title: true,
    alt: true,
    location: true,
    attribution: true,
    tags: true
  }
} = config;

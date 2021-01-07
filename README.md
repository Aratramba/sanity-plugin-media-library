# Media Library for Sanity

The missing media library for Sanity. With support for filters per tag and extension. And it's fully themeable! 🔥

![Media library in dark theme](https://user-images.githubusercontent.com/2776959/102903827-c528b900-4468-11eb-8aa1-c4f687c6a16f.png)

![Media library in light theme](https://user-images.githubusercontent.com/2776959/102904010-0751fa80-4469-11eb-9980-eb45282c6f2a.png)

## Features
- Media library appears in CMS navigation
- Support for images and files
- View/Edit your assets in once single place:
  - View asset details
  - Add alt tags to your image in a central place
- Grid view and list view (with more details):
  - Sort by latest or alphabetically
  - Search by alt, tag, or file name
  - View asset details in a list view
- Asset organizing:
  - Add tags to your assets to create structure in your media library
  - Select 1 or multiple assets with cmd/ctrl or shift
  - Delete 1 or multiple asset(s) at a time
  - Filter by (multiple) file extension(s) or tag(s)
  - Clear filters with a click on a button
  - Drag 1 or multiple assets to a tag to add them
- Asset uploading:
  - Upload 1 or multiple files with the upload button
  - Also drag to upload 1 or multiple files
- Asset source:
  - Use it where it's useful: select images with the media library in your documents
- Quick action: Double click an asset to trigger it's primary action
- Customizable theme:
  - Comes with a dark and light theme, both are fully customizable.

## Installation

### Automagically
In your Sanity project's directory run :

```
sanity install media-library
```

### Manually

```
yarn add sanity-plugin-media-library
```

or

```
npm install --save sanity-plugin-media-library
```

#### Adding the library
In your `sanity.json` add it to the list of plugins:

```json
{
  "plugins": [
    "@sanity/base",
    "@sanity/components",
    "@sanity/default-layout",
    "@sanity/default-login",
    "@sanity/desk-tool",
    "media-library"
  ]
}
```

## Installing as asset source
Using the media library as an asset source requires a little more configuration.
In your `sanity.json` add the following to the `parts` array:

```json
{
  "implements": "part:@sanity/form-builder/input/image/asset-source",
  "path": "./assetSource.js"
}
```

And in `assetSource.js` add:

```javascript
import AssetSource from "part:sanity-plugin-media-library/asset-source";
export default [AssetSource];
```

Done, you're ready to go!

## Configuration / Theming
After installing the plugin, a config file is automatically created at `config/media-library.json`.

In this file you can set the theme to `light` or `dark` and optionally add themeChanges. For a list of available options see the keys in [/src/themes/darkTheme.ts](/src/themes/darkTheme.ts).

```json
{
  "theme": "dark",
  "themeChanges": {}
}
```

Example with themeChanges:
```json
{
  "theme": "light",
  "themeChanges": {
    "bottomBarBorderColor": "hotpink",
    "buttonPrimaryBorderColor": "hotpink"
  }
}
```

## Roadmap
Find the roadmap in [Github Projects](https://github.com/dennispassway/sanity-plugin-media-library/projects/1).

## Contributing
To contribute a theme, add it in `themes/[themename].ts`.
If you run into problems or have feature requests, please create an issue or pull request and I'll look into it as soon as I can.
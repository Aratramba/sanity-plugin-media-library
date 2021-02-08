// https://github.com/playwright-community/jest-playwright/#configuration
module.exports = {
  browsers: ['chromium'],
  exitOnPageError: false,
  launchOptions: {
    headless: false,
  },
  devices: [
    {
      name: 'test',
      viewport: {
        width: 1400,
        height: 1400,
      },
      userAgent: 'chromium',
      deviceScaleFactor: 1,
      isMobile: false,
      hasTouch: false,
    },
  ],
  serverOptions: {
    launchTimeout: 30000,
    command: 'yarn test-studio',
  },
};

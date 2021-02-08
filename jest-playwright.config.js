// https://github.com/playwright-community/jest-playwright/#configuration
module.exports = {
  browsers: ['chromium'],
  exitOnPageError: false,
  launchOptions: {
    headless: true,
  },
  devices: [
    {
      name: 'test',
      viewport: {
        width: 2000,
        height: 2000,
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

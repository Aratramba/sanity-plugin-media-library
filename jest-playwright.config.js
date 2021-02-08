// https://github.com/playwright-community/jest-playwright/#configuration
module.exports = {
  browsers: ['chromium'],
  exitOnPageError: false,
  launchOptions: {
    headless: true,
  },
  serverOptions: {
    launchTimeout: 60000,
    command: 'yarn test-studio',
  },
};

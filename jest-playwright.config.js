// https://github.com/playwright-community/jest-playwright/#configuration
module.exports = {
  browsers: ['chromium'],
  exitOnPageError: false,
  launchOptions: {
    headless: false,
  },
  serverOptions: {
    command: 'yarn test-studio',
  },
};

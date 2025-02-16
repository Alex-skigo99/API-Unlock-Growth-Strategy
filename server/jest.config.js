const config = {
  testTimeout: 60000,
  testEnvironment: "node",
  forceExit: true,
  verbose: true, // show more info
  silent: true, // doesn't show console logs
  detectOpenHandles: false // will show open handlers which are running like mongo, node-cron etc.
};

export default config;

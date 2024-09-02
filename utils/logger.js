//const Sentry = require("@sentry/node");
const info = (...params) => {
  console.log(...params);
  //Sentry.captureMessage(params.join(" "), "info");
};

const error = (...params) => {
  console.error(...params);
  //Sentry.captureMessage(params.join(" "), "info");
};

module.exports = {
  info,
  error,
};

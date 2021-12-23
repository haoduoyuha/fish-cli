const ora = require("ora");
const log = require("npmlog");

exports.withSpinner = function (fn, options = {}) {
  const {
    text = "fetching",
    errorText = "fetching failed!",
    successText = "",
  } = options;
  const spinner = ora(text);

  return async (...args) => {
    try {
      spinner.start();
      const response = await fn(...args);
      successText && spinner.succeed(successText);
      spinner.stop();
      return response;
    } catch (err) {
      spinner.error(errorText);
      log.error(err);
    }
  };
};

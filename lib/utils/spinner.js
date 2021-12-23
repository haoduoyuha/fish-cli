const ora = require("ora");
const log = require("npmlog");

exports.withSpinner = async function (fn, options = {}) {
  const { text = "fetching", errorText = "fetching failed!" } = options;
  const spinner = ora(text);
  try {
    spinner.start();
    const response = await fn();
    spinner.stop();
    return response;
  } catch (err) {
    spinner.error(errorText);
    log.error(err);
  }
};

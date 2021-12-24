const Command = require("./command");
const InitCommand = require("./init");

module.exports = function factory(type, ...args) {
  switch (type) {
    case "command":
      return new Command(...args);
    case "init":
      return new InitCommand(...args);
  }
};

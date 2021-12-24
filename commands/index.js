const Command = require("./Command");
const InitCommand = require("./Init");

module.exports = function factory(type, ...args) {
  switch (type) {
    case "command":
      return new Command(...args);
    case "init":
      return new InitCommand(...args);
  }
};

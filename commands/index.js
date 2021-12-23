const Command = require("./command");
const InitCommand = require("./init");

module.exports = function factory(type, ...args) {
  console.log(333);
  switch (type) {
    case "command":
      return new Command(...args);
    case "init":
      return new InitCommand(...args);
  }
};

const pkg = require("../package.json");
const constent = require("./constent");
const { program } = require("commander");
const chalk = require("chalk");
const log = require("npmlog");
const semver = require("semver");
const createCommandFactory = require("../commands");

// 检查cli版本
function checkPkgVersion() {
  log.info("fish-cli", pkg.version);
}
// 检查node版本
function checkNodeVersion() {
  const currentNodeVersion = process.version;
  const lowerstNodeVersion = constent.LOWEST_NODE_VERSION;
  if (!semver.gte(currentNodeVersion, lowerstNodeVersion)) {
    throw new Error(
      log.error(
        `fish-cli需要安装${lowerstNodeVersion}版本以上的node,请升级您的node版本`
      )
    );
  }
}
// 建议命令
function suggestCommands(unknownCommand) {
  const availableCommands = program.commands.map((cmd) => cmd.name());
  let suggestion;
  availableCommands.forEach((cmd) => {
    const isBestMatch =
      leven(cmd, unknownCommand) < leven(suggestion || "", unknownCommand);
    if (leven(cmd, unknownCommand) < 3 && isBestMatch) {
      suggestion = cmd;
    }
  });
  if (suggestion) {
    console.log(colors.red(`Did you mean ${colors.yellow(suggestion)}?`));
  }
}

function init(projectName, options) {
  return createCommandFactory("init", projectName).init(options);
}

function registerCommand() {
  program
    .name(pkg.name)
    .usage(`${chalk.green("<command>")} [options]`)
    .version(pkg.version, "-v, --version", "输出当前cli版本")
    .option("-d, --debug", "开启debug模式", false);

  program
    .command("init <project-name>")
    .description("创建一个新项目")
    .option("-f, --force", "目标文件夹存在时强制覆盖")
    .option("-n, --no-git", "跳过初始化git仓库")
    .option(
      "-p, --preset <presetName>",
      "Skip prompts and use saved or remote preset"
    )
    .action(init);

  //   program
  //     .command("add <component-name>")
  //     .description("创建组件（页面）")
  //     .option("-l, --language <language-name>", "设置框架语言", "react")
  //     .option("-e, --extension <extension-name>", "设置文件后缀", "js")
  //     .option("-t, --template <template-path>", "指定模板文件")
  //     .option("-t, --target", "指定目录")
  //     .option("-g, --global", "全局设置", false)
  //     .action((component, options) => {
  //       require("./add")(component, options);
  //     });

  program.on("option:debug", () => {
    // if (program.opts().debug) {
    //   // 调试模式
    //   process.env.LOG_LEVEL = "verbose";
    // } else {
    //   process.env.LOG_LEVEL = "info";
    // }
  });

  // 监听其他未注册的命令
  program.on("command:*", ([cmd]) => {
    log.warn(chalk.red(`未知命令 ${chalk.yellow(cmd)}`));
    suggestCommands(cmd);
    // program.outputHelp();
  });

  program.parse(process.argv);
}

module.exports = function core() {
  try {
    checkPkgVersion();
    checkNodeVersion();
    registerCommand();
  } catch (err) {
    console.log(err, "err");
  }
};

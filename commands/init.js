const path = require("path");
const inquirer = require("inquirer");
const Command = require("./command");
const checkTargetDir = require("../lib/checkTargetDir");

class InitCommand extends Command {
  constructor(projectName) {
    super();
    this.projectName = projectName;
    this.projectInfo = {};
  }

  async init(cliOptions) {
    // 1. 获取目标文件夹
    const targetDir = this.resolveTargetDir();
    // 1. 目录非空检查
    await checkTargetDir(targetDir, cliOptions);
    // 2. 询问项目信息
    await this.getProjectInfo();
    // 3. 获取远程项目模板
    const templateInfo = await this.getTemplateInfo();
    // 3. 执行下载逻辑
    await this.downloadTemplate(templateInfo);
  }

  resolveTargetDir() {
    const cwd = process.cwd();
    return path.resolve(cwd, this.projectName);
  }

  async getProjectInfo() {
    const projectInfo = await inquirer.prompt([
      {
        name: "description",
        type: "input",
        message: "请输入项目描述",
      },
      {
        name: "varsion",
        type: "input",
        message: "请输入项目版本",
      },
    ]);
    this.projectInfo = projectInfo;
  }

  resolveFinalPrompt() {
    return {
      ...this.projectInfo,
    };
  }

  async getTemplateInfo() {}

  async downloadTemplate() {}
}

function factory(projectName) {
  return new InitCommand(projectName);
}

module.exports = factory;

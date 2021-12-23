const path = require("path");
const inquirer = require("inquirer");
const Command = require("./command");
const Package = require("../lib/package");
const checkTargetDir = require("../lib/checkTargetDir");
const { getRepoList } = require("../lib/http");
const { withSpinner } = require("../lib/spinner");

class InitCommand extends Command {
  constructor(projectName) {
    super();
    this.projectName = projectName;
    this.targetPath = this.resolveTargetDir();
    this.projectInfo = {};
  }

  async init(cliOptions) {
    // 1. 目录非空检查
    await checkTargetDir(this.targetPath, cliOptions);
    // 2. 询问项目信息
    await this.getProjectInfo();
    // 3. 获取远程项目模板
    const templateInfo = await this.getTemplateInfo();
    // 4. 执行下载逻辑
    await this.downloadTemplate(templateInfo);
    // 5. 拷贝项目模板到目标目录，并执行模板渲染逻辑
    this.copyAndRenderTemplate();
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

  async getTemplateInfo() {
    const repoList = await withSpinner(getRepoList, {
      text: "正在获取远程模板信息，请稍等...",
    });
    console.log(repoList);

    return repoList;
  }

  async downloadTemplate() {
    const _package = new Package({
      name: this.projectName,
    });
    if (template.exist()) {
      _package.update();
    } else {
      _package.install();
    }
  }

  copyAndRenderTemplate() {}
}

function factory(projectName) {
  return new InitCommand(projectName);
}

module.exports = factory;

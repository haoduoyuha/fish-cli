const path = require("path");
const inquirer = require("inquirer");
const Command = require("./command");
const Package = require("../lib/Package");
const checkTargetPathExist = require("../lib/checkTargetPathExist");
const { getRepoList } = require("../lib/utils/getRepoInfo");
const { withSpinner } = require("../lib/utils/spinner");

/**
 * @description initCommand创建模板的基本流程
 * 目录重名检查 ------> 通过github，restApi获取远程仓库列表 --------> 执行创建逻辑
 * 创建流程：查看本地缓存目录是否存在当前模板，存在，则更新模板，否则重新下载 ------> 根据是否有meta文件判断模板是否为自定义模板，是则inquirer询问用户输入选
 * 择----> 获取根据用户输入的配置信息 ejs动态渲染内容 -----> 将渲染后的文件写入当前目录，不是则直接拷贝到当前目录 -----> 开启node子进程，进行依赖安装
 * ----> 结束
 */
class InitCommand extends Command {
  constructor(projectName) {
    super();
    this.projectName = projectName;
    this.targetPath = this.resolveTargetDir();
    this.projectInfo = {};
  }

  async init(cliOptions) {
    // 检查目标目录是否存在
    await checkTargetPathExist(this.targetPath, cliOptions);
    // 获取远程仓库模板列表
    // const templateInfo = await this.getTemplateInfo();
    // 执行创建逻辑
    await this.create();
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
    })();
    console.log(repoList);

    return repoList;
  }

  async create() {
    const _package = new Package({
      name: this.projectName,
    });
    if (_package.exist()) {
      await _package.update();
    } else {
      await _package.install();
    }
  }
}

function factory(projectName) {
  return new InitCommand(projectName);
}

module.exports = factory;

const path = require("path");
const inquirer = require("inquirer");
const ncp = require("ncp").ncp;
const log = require("npmlog");
const fs = require("fs-extra");
const Command = require("./command");
const GitPackage = require("../lib/package/git");
const checkTargetPathExist = require("../lib/checkTargetPathExist");
const installDependencies = require("../lib/utils/install");
const { getRepoList } = require("../lib/utils/getRepoInfo");
const { withSpinner } = require("../lib/utils/spinner");
const constent = require("../lib/constent");

/**
 * @description initCommand创建模板的基本流程
 * 目录重名检查 ------> 通过github，restApi获取远程仓库列表 --------> 执行创建逻辑
 * 创建流程：查看本地缓存目录是否存在当前模板，存在，则更新模板，否则重新下载 ------> 根据是否有meta文件判断模板是否为自定义模板，是则inquirer询问用户输入选
 * 择----> 获取根据用户输入的配置信息 ejs动态渲染内容 -----> 将渲染后的文件写入当前目录，不是则直接拷贝到当前目录 -----> 开启node子进程，进行依赖安装
 * ----> 结束
 */
class InitCommand extends Command {
  cliConfig = {
    prompt: [],
    runCommand: "",
  };

  constructor(projectName, prompts) {
    super();
    this.projectName = projectName;
    this.targetPath = this.resolveTargetDir();
    this.prompts = prompts || [];
  }

  async init(cliOptions) {
    try {
      const template = this.prepare(cliOptions);
      // 执行创建
      await this.create(template);
      // 安装依赖
      await installDependencies();
      // 运行项目
      await run();
    } catch (err) {
      log.error(err);
    }
  }

  async prepare(cliOptions) {
    // 检查目标目录是否存在
    await checkTargetPathExist(this.targetPath, cliOptions);
    // 获取远程项目模板列表
    const templateList = await this.getTemplateInfo();
    // 选择模板
    const { template } = await this.ask({});

    return template;
  }

  resolveTargetDir() {
    const cwd = process.cwd();
    return path.resolve(cwd, this.projectName);
  }

  async getTemplateInfo() {
    let templateInfo = {};
    // 获取模板列表
    const repoList = (templateInfo.repoList = await withSpinner(getRepoList, {
      text: "正在获取远程模板列表，请稍等...",
    })());
    if (repoList && repoList.length > 0) {
      // 获取版本号
      templateInfo.varsionList = await withSpinner(getRepoList, {
        text: "正在获取版本信息，请稍等...",
      })();
    } else {
      return Promise.reject("暂无可用的模板，请上传后再试哦～");
    }
    return templateInfo;
  }

  async ask(question) {
    const answers = await inquirer.prompt(question);
    return answers;
  }

  // 核心创建逻辑
  async create(templateList) {
    const _package = new GitPackage({
      name: this.projectName,
    });

    if (_package.exist()) {
      await _package.update();
    } else {
      await _package.install();
    }
    const packageRootPath = _package.getRootPath();

    if (!packageRootPath) {
      return;
    }
    if (
      fs.existsSync(`${packageRootPath}/${constent.CLI_COINFIG_FILE_NAME}.js`)
    ) {
      // 如果有自定义配置文件
      const answers = await this.ask([]);
      if (answers.useTypescript) {
        // 使用ts
      }
      // 拿到结果，通过ejs动态渲染
    } else {
      // 直接拷贝到目标目录
      // ncp(source, destination, function (err) {
      //   if (err) {
      //     return console.error(err);
      //   }
      //   console.log("done!");
      // });
    }
  }

  async run() {
    console.log("运行项目...");
  }
}

function factory(projectName) {
  return new InitCommand(projectName);
}

module.exports = factory;

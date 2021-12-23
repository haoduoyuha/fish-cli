const downloadGitRepo = require("../lib/utils/downGitRepo");
const { withSpinner } = require("../lib/utils/spinner");

class Package {
  constructor(name, storePath) {
    this.name = name;
    this.storePath = storePath || "demo";
  }
  getRootPath() {}

  exist() {
    return false;
  }

  install() {
    return withSpinner(downloadGitRepo, {
      text: "正在下载模板，请稍等...",
    })(
      "https://gitlab.com/flippidippi/download-git-repo-fixture.git",
      "template"
    );
  }

  update() {
    // return withSpinner(downloadGitRepo, {
    //   text: "正在更新模板，请稍等...",
    // })(
    //   "https://gitlab.com/flippidippi/download-git-repo-fixture.git",
    //   "template"
    // );
  }
}

function factory(...args) {
  return new Package(...args);
}

module.exports = factory;

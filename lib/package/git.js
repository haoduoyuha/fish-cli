const Package = require(".");
const downloadGitRepo = require("../utils/downGitRepo");
const { withSpinner } = require("../utils/spinner");

module.exports = class GitPackage extends Package {
  constructor(name, storePath) {
    super(name, storePath);
  }

  install() {
    return withSpinner(downloadGitRepo, {
      text: "正在下载模板，请稍等...",
    })(
      "https://gitlab.com/flippidippi/download-git-repo-fixture.git",
      "template"
    );
  }
};

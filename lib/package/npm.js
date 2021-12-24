const Package = require(".");

module.exports = class NpmPackage extends Package {
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

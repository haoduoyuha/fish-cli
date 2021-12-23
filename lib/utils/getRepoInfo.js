const request = require("./request");

/**
 * 获取模板列表
 * @returns Promise
 */
async function getRepoList() {
  return request.get("https://api.github.com/orgs/fish-cli/repos");
}

/**
 * 获取版本信息
 * @param {string} repo 模板名称
 * @returns Promise
 */
async function getTagList(repo) {
  return request.get(`https://api.github.com/repos/fish-cli/${repo}/tags`);
}

module.exports = {
  getRepoList,
  getTagList,
};

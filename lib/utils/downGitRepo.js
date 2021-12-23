const download = require("download-git-repo");

module.exports = function (url, path) {
  return new Promise((resolve, reject) => {
    download(`direct:${url}`, path, { clone: true }, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

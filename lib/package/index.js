module.exports = class Package {
  constructor(name, storePath) {
    this.name = name;
    this.storePath = storePath || "demo";
  }
  getRootPath() {
    return "";
  }
  exist() {
    return false;
  }
};

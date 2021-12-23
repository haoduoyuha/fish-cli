class Template {
  constructor(name, storePath) {
    this.name = name;
    this.storePath = storePath;
  }
  getRootPath() {}

  exist() {
    return true;
  }

  install() {}

  update() {}
}

function factory(...args) {
  return new Template(...args);
}

module.exports = factory;

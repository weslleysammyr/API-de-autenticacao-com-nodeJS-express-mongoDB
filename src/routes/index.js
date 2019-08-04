const home = require("./home");
const users = require("./users");

const install = app => {
  home.install(app);
  users.install(app);
};

module.exports = {
  install
};

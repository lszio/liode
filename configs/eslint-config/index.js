module.exports = require("./configs/base.eslintrc");
module.exports = require("./configs/warnings.eslintrc")
module.exports = require("./configs/error.eslintrc")
module.exports = {
  extends: [
    "turbo",
    "prettier",
    "./configs/base.eslintrc",
    "./configs/warnings.eslintrc",
    "./configs/error.eslintrc.js"
  ],
};

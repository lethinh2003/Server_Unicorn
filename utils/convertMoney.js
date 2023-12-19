var format = require("format-number");
const convertMoney = (money) => {
  return format({ suffix: " đ" })(money);
};
module.exports = {
  convertMoney,
};
